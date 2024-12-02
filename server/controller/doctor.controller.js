const { default: mongoose } = require("mongoose");
const Doctor = require("../models/Doctors.model");
const Patient = require("../models/Patients.model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    return res.status(200).send(doctor);
  } catch (error) {
    console.log("ere", error);
    if (error.code === 11000) {
      res.status(409).send({ error: "Email already exists!" });
    }
    res.status(500).send(error);
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.body.email });
    console.log("login", doctor);
    if (!doctor) {
      return res
        .status(400)
        .send({ error: "No doctor found with the provided email!" });
    }
    doctor.comparePassword(req.body.password, (err, isMatch) => {
      if (!!err || !isMatch) {
        console.log("in here");
        return res.status(401).send({ error: "Wrong Password!" });
      }
      const token = jwt.sign({ id: doctor._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res
        .status(200)
        .send({ doctor, token, expiresIn: "14400", userType: "doctor" });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addToWaitlist = async (req, res) => {
  try {
    const { patientId, doctorId, requestDate, requestTime } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found!" });
    }

    const isSlotBooked = doctor.appointments.some((appointment) => {
      appointment.appointmentDate.getTime() ===
        new Date(requestDate).getTime() &&
        appointment.appointmentTime === requestTime &&
        appointment.appointmentStatus === "pending";
    });

    if (isSlotBooked) {
      doctor.waitlist.push({
        patient: patientId,
        requestedDate: new Date(requestDate),
        requestedTime: requestTime,
      });
      await doctor.save();
      return res.status(200).send({ message: "Added to waitlist" });
    }
    return res
      .status(200)
      .send({ message: "Slot is available, you can book an appointment" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.getTotalAppointments = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const totalAppointments = await Doctor.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(doctorId),
        },
      },
      {
        $unwind: "$appointments",
      },
      {
        $group: {
          _id: doctorId,
          totalAppointments: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalAppointments: -1,
        },
      },
    ]);

    if (!totalAppointments) {
      return res.status(404).send({ message: "No Appointments Found" });
    }
    return res.status(200).send(...totalAppointments);
  } catch (error) {
    res.status(500).send({ error });
  }
};

exports.fetchDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    if (!doctorId) {
      return res.status(400).send({ message: "Doctor ID is required!" });
    }
    const query = {
      _id: doctorId,
    };

    if (date) {
      // Parse the date string into a Date object
      const appointmentDate = new Date(date);
    
      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).send({ message: "Invalid date format" });
      }
    
      // Get the start and end of the given day (in UTC)
      const startOfDay = new Date(appointmentDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(appointmentDate.setUTCHours(23, 59, 59, 999));
    
      // Add to query: appointments with appointmentDate between start and end of day
      query["appointments.appointmentDate"] = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
    const doctor = await Doctor.findOne(query).populate("appointments.patient");
    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found." });
    }

    // Filter the appointments based on status and optionally date
    const filteredAppointments = doctor.appointments.filter((appointment) => {
      if (
        date &&
        appointment.appointmentDate.toDateString() !==
          new Date(date).toDateString()
      ) {
        return false;
      }
      return true;
    });

    return res.status(200).send({ appointments: filteredAppointments });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { appointmentId, doctorId, patientId } = req.body;
    const cancellationTime = new Date();
    console.log("Received appointmentId:", new mongoose.Types.ObjectId(appointmentId));

    // Validate appointmentId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new Error("Invalid appointment ID");
    }
    const doctor = await Doctor.findOne({
      "appointments._id": new mongoose.Types.ObjectId(appointmentId),
    });
    console.log("Matched Doctor document:", doctor);
    const doctorUpdate = await Doctor.findOneAndUpdate(
      {
        _id: doctorId,
        appointments: {
          $elemMatch: {
            _id: new mongoose.Types.ObjectId(appointmentId),
            appointmentStatus: { $nin: ["completed", "cancelled"] },
          },
        },
      },
      {
        $set: { "appointments.$.appointmentStatus": "cancelled" },
      },
      { session, new: true }
    );
    
    if (!doctorUpdate) {
      console.error("Doctor not found or appointment already completed/cancelled");
      throw new Error("Failed to update doctor record or appointment not found");
    }
    
    console.log("Doctor updated successfully:", doctorUpdate);
    
    // Find and update the Patient's document to cancel the appointment
    const patientUpdate = await Patient.findOneAndUpdate(
      {
        _id: patientId,
        appointments: {
          $elemMatch: {
            _id: new mongoose.Types.ObjectId(appointmentId),
            appointmentStatus: { $nin: ["completed", "cancelled"] },
          },
        },
      },
      {
        $set: { "appointments.$.appointmentStatus": "cancelled" },
      },
      { session, new: true }
    );

    if (!patientUpdate) {
      throw new Error(
        "Failed to update patient record or appointment not found"
      );
    }

    // Calculate cancellation fee based on appointment time
    const appointment = doctorUpdate.appointments.find(
      (appt) => appt._id.toString() === appointmentId
    );

    if (!appointment) {
      throw new Error("Appointment details not found in Doctor's record");
    }

    const appointmentDateTime = new Date(appointment.appointmentDate);
    appointmentDateTime.setHours(...appointment.appointmentTime.split(":"));

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

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Appointment cancelled successfully",
      cancellationFee,
    });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    console.error("Error in cancelAppointment:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      oldAppointmentDate,
      oldAppointmentTime,
      newAppointmentDate,
      newAppointmentTime,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const patientUpdate = await Patient.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(patientId),
          "appointments.doctor": new mongoose.Types.ObjectId(doctorId),
          "appointments.appointmentDate": new Date(oldAppointmentDate),
          "appointments.appointmentTime": oldAppointmentTime,
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
        return res
          .status(404)
          .send({ message: "Appointment not found for the patient" });
      }

      const doctorUpdate = await Doctor.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(doctorId),
          "appointments.appointmentDate": new Date(oldAppointmentDate),
          "appointments.appointmentTime": oldAppointmentTime,
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
        return res
          .status(404)
          .send({ message: "Appointment not found for the doctor" });
      }

      await session.commitTransaction();

      return res

        .status(200)
        .send({ message: "Appointment rescheduled successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).send({ error });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};
exports.createDocAppointment = async (req, res) => {
  console.log('s')
  console.log(req.body);

    try {
      const {
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
        appointmentLocation,
      } = req.body;
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).send({ error: "Invalid doctor ID" });
      }
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