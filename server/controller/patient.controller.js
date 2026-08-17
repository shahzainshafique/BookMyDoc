const Patient = require("../models/Patients.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Doctor = require("../models/Doctors.model");

const JWT_SECRET = process.env.JWT_SECRET;

//create new Patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    return res.status(200).send(patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    if (error.code === 11000) {
      return res.status(409).send({ error: "Email already exists!" });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email });
    if (!patient) {
      return res.status(400).send({ error: "User not found" });
    }
    patient.comparePassword(req.body.password, (err, isMatch) => {
      // Reject on hashing error OR when the password does not match.
      if (err || !isMatch) {
        return res.status(401).send({ error: "Wrong Password!" });
      }
      const token = jwt.sign({ id: patient._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res
        .status(200)
        .send({ patient, token, expiresIn: "3600", userType: "patient" });
    });
  } catch (exp) {
    console.log(exp);
    res.status(500).send(exp);
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    // The authenticated patient can only book for themselves.
    const patientId = req.user.id;
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      appointmentLocation,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).send({ error: "Invalid doctor ID" });
    }
    if (!appointmentDate || !appointmentTime) {
      return res
        .status(400)
        .send({ error: "Appointment date and time are required" });
    }

    // Location is required by the schema; default to the clinic when omitted.
    const location = appointmentLocation || "Clinic";

    // A shared id keeps the doctor's and patient's copies of the
    // appointment in sync so it can later be cancelled/rescheduled.
    const appointmentId = uuidv4();

    // Check for a conflicting (non-cancelled) appointment for this doctor.
    const conflictingAppointment = await Doctor.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(doctorId) } },
      { $unwind: "$appointments" },
      {
        $match: {
          "appointments.appointmentDate": new Date(appointmentDate),
          "appointments.appointmentTime": appointmentTime,
          "appointments.appointmentStatus": { $ne: "cancelled" },
        },
      },
    ]);

    if (conflictingAppointment.length > 0) {
      return res.status(400).send({
        error: "Doctor is already booked at this time",
      });
    }

    // Begin transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update patient record
      await Patient.findByIdAndUpdate(
        patientId,
        {
          $push: {
            appointments: {
              appointmentId,
              doctor: doctorId,
              appointmentDate,
              appointmentTime,
              appointmentLocation: location,
            },
          },
        },
        { new: true, session }
      );

      // Update doctor record to add the appointment
      await Doctor.findByIdAndUpdate(
        doctorId,
        {
          $push: {
            appointments: {
              appointmentId,
              patient: patientId,
              appointmentDate,
              appointmentTime,
              appointmentLocation: location,
            },
          },
        },
        { new: true, session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(201).send({
        message: "Appointment booked successfully",
        appointment: {
          appointmentId,
          doctor: doctorId,
          appointmentDate,
          appointmentTime,
          appointmentLocation: location,
        },
      });
    } catch (error) {
      // Abort the transaction in case of an error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

// Return the authenticated patient's appointments with doctor details.
exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const patient = await Patient.findById(patientId).populate({
      path: "appointments.doctor",
      select: "firstname lastname specialization profileImage",
    });

    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }

    // Newest appointments first.
    const appointments = [...patient.appointments].sort(
      (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
    );

    return res.status(200).send({ appointments });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const patientId = req.user.id;
    const { appointmentId, doctorId } = req.body;
    const cancellationTime = new Date();

    if (
      !appointmentId ||
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(patientId)
    ) {
      throw new Error("Invalid appointment or IDs provided");
    }

    // Update the patient's copy of the appointment.
    const patientUpdate = await Patient.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(patientId),
        appointments: {
          $elemMatch: {
            appointmentId,
            appointmentStatus: { $nin: ["completed", "cancelled"] },
          },
        },
      },
      { $set: { "appointments.$.appointmentStatus": "cancelled" } },
      { session, new: true }
    );

    if (!patientUpdate) {
      throw new Error(
        "Appointment not found, or already completed/cancelled"
      );
    }

    // Update the doctor's copy of the appointment.
    const doctorUpdate = await Doctor.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(doctorId),
        appointments: {
          $elemMatch: {
            appointmentId,
            appointmentStatus: { $nin: ["completed", "cancelled"] },
          },
        },
      },
      { $set: { "appointments.$.appointmentStatus": "cancelled" } },
      { session, new: true }
    );

    if (!doctorUpdate) {
      throw new Error(
        "Appointment not found on the doctor's record, or already completed/cancelled"
      );
    }

    // Calculate cancellation fee based on notice given.
    const appointment = patientUpdate.appointments.find(
      (appt) => appt.appointmentId === appointmentId
    );
    const appointmentDateTime = new Date(appointment.appointmentDate);
    if (appointment.appointmentTime) {
      appointmentDateTime.setHours(...appointment.appointmentTime.split(":"));
    }
    const hoursUntilAppointment =
      (appointmentDateTime - cancellationTime) / (1000 * 60 * 60);

    let cancellationFee = 0;
    if (hoursUntilAppointment < 1) {
      cancellationFee = 50;
    } else if (hoursUntilAppointment < 24) {
      cancellationFee = 25;
    } else {
      cancellationFee = 10;
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).send({
      message: "Appointment cancelled successfully",
      cancellationFee,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error cancelling appointment:", error);
    return res
      .status(500)
      .send({ error: error.message || "Internal Server Error" });
  }
};

exports.reScheduleAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const patientId = req.user.id;
    const {
      appointmentId,
      doctorId,
      newAppointmentDate,
      newAppointmentTime,
    } = req.body;

    if (
      !appointmentId ||
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !newAppointmentDate ||
      !newAppointmentTime
    ) {
      throw new Error("Missing or invalid reschedule details");
    }

    // Reject if the doctor is already booked at the new slot.
    const conflict = await Doctor.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(doctorId) } },
      { $unwind: "$appointments" },
      {
        $match: {
          "appointments.appointmentId": { $ne: appointmentId },
          "appointments.appointmentDate": new Date(newAppointmentDate),
          "appointments.appointmentTime": newAppointmentTime,
          "appointments.appointmentStatus": { $ne: "cancelled" },
        },
      },
    ]);

    if (conflict.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "Doctor is already booked at the new time" });
    }

    const patientUpdate = await Patient.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(patientId),
        "appointments.appointmentId": appointmentId,
      },
      {
        $set: {
          "appointments.$.appointmentDate": new Date(newAppointmentDate),
          "appointments.$.appointmentTime": newAppointmentTime,
          "appointments.$.appointmentStatus": "rescheduled",
        },
      },
      { session, new: true }
    );

    if (!patientUpdate) {
      throw new Error("Appointment not found for the patient");
    }

    const doctorUpdate = await Doctor.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(doctorId),
        "appointments.appointmentId": appointmentId,
      },
      {
        $set: {
          "appointments.$.appointmentDate": new Date(newAppointmentDate),
          "appointments.$.appointmentTime": newAppointmentTime,
          "appointments.$.appointmentStatus": "rescheduled",
        },
      },
      { session, new: true }
    );

    if (!doctorUpdate) {
      throw new Error("Appointment not found for the doctor");
    }

    await session.commitTransaction();
    session.endSession();
    return res
      .status(200)
      .send({ message: "Appointment rescheduled successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error rescheduling appointment:", error);
    return res
      .status(500)
      .send({ error: error.message || "Internal Server Error" });
  }
};
