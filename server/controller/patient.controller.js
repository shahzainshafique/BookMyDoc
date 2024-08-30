const Patient = require("../models/Patients.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Doctor = require("../models/Doctors.model");

const JWT_SECRET = process.env.JWT_SECRET;

//create new Patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    return res.status(200).send(patient);
  } catch (exp) {
    res.sendStatus(500);
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email });
    if (!patient) {
      return res.status(400).send({ error: "User not found" });
    }
    patient.comparePassword(req.body.password, (err, isMatch) => {
      if (!!err || !!isMatch) {
        console.log(err);
        return res.status(400).send({ error: err });
      }
      const token = jwt.sign({ id: patient._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log(token);
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
    const { patientId, doctorId, appointmentDate, appointmentTime, appointmentLocation } = req.body;

    // Start the timer
    const startTime = new Date();

    // Check for conflicting appointments in the Doctor's collection
    const conflictingAppointment = await Doctor.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(doctorId),
        },
      },
      {
        $unwind: "$appointments",
      },
      {
        $match: {
          "appointments.appointmentDate": new Date(appointmentDate),
          "appointments.appointmentTime": appointmentTime,
        },
      },
    ]);

    // End the timer
    const endTime = new Date();
    const timeTaken = endTime - startTime;
    console.log(`Aggregation pipeline took ${timeTaken}ms to execute`);

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
              doctor: doctorId,
              appointmentDate,
              appointmentTime,
              appointmentLocation,
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
              patient: patientId,
              appointmentDate,
              appointmentTime,
              appointmentLocation,
            },
          },
        },
        { new: true, session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(201).send({
        message: `Appointment booked successfully in ${timeTaken}ms`,
        appointment: {
          doctor: doctorId,
          appointmentDate,
          appointmentTime,
          appointmentLocation,
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

exports.cancelAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime } = req.body;

    // Get current time
    const cancellationTime = new Date();

    // Find the appointment in the patient's record to calculate cancellation fee
    const patient = await Patient.findById(patientId).select('appointments');

    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }

    // Find the appointment in the patient's appointments
    const appointment = patient.appointments.find(
      (app) =>
        app.doctor.toString() === doctorId &&
        app.appointmentDate.toISOString() === new Date(appointmentDate).toISOString() &&
        app.appointmentTime === appointmentTime
    );

    if (!appointment) {
      return res.status(404).send({ error: "Appointment not found" });
    }

    // Calculate the time difference in hours between cancellation and appointment
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const hoursUntilAppointment = (appointmentDateTime - cancellationTime) / (1000 * 60 * 60);

    // Determine the cancellation fee based on time until the appointment
    let cancellationFee = 0;
    if (hoursUntilAppointment < 1) {
      cancellationFee = 50; // Less than 1 hour before the appointment
    } else if (hoursUntilAppointment < 24) {
      cancellationFee = 25; // Less than 24 hours before the appointment
    } else {
      cancellationFee = 10; // More than 24 hours before the appointment
    }

    // Begin transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove the appointment from the patient's record
      await Patient.findByIdAndUpdate(
        patientId,
        {
          $pull: {
            appointments: {
              doctor: doctorId,
              appointmentDate: new Date(appointmentDate),
              appointmentTime,
            },
          },
        },
        { session }
      );

      // Remove the appointment from the doctor's record
      await Doctor.findByIdAndUpdate(
        doctorId,
        {
          $pull: {
            appointments: {
              patient: patientId,
              appointmentDate: new Date(appointmentDate),
              appointmentTime,
            },
          },
        },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).send({
        message: "Appointment cancelled successfully",
        cancellationFee,
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


