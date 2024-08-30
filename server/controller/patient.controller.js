const Patient = require("../models/Patients.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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

    // Use aggregation to check for existing appointments and fetch doctor availability
    const result = await Patient.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(patientId),
        },
      },
      {
        $unwind: "$appointments",
      },
      {
        $match: {
          "appointments.doctor": new mongoose.Types.ObjectId(doctorId),
          "appointments.appointmentDate": new Date(appointmentDate),
          "appointments.appointmentTime": appointmentTime,
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "appointments.doctor",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $unwind: "$doctorDetails",
      },
      {
        $project: {
          doctorName: { $concat: ["$doctorDetails.firstname", " ", "$doctorDetails.lastname"] },
          appointmentTime: "$appointments.appointmentTime",
          appointmentDate: "$appointments.appointmentDate",
          patientId: "$_id",
        },
      },
    ]);

    // End the timer
    const endTime = new Date();
    const timeTaken = endTime - startTime;
    console.log(`Aggregation pipeline took ${timeTaken}ms to execute`);

    if (result.length > 0) {
      return res.status(400).send({ error: "Doctor is not available at this time" });
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

