const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  profileImage:{
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  availableSlots: [
    {
      dayOfWeek: {
        type: String,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
  ],
  appointments: [
    {
      appointmentId: {
        type: String,
        required: true, // Ensures every appointment has a unique identifier
        unique: true,   // Enforces uniqueness for this identifier
      },
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
      appointmentDate: {
        type: Date,
        required: true,
      },
      appointmentTime: {
        type: String,
        required: true,
      },
      appointmentLocation: {
        type: String,
        required: true,
      },
      appointmentStatus: {
        type: String,
        enum: ["pending", "cancelled", "completed"],
        default: "pending",
      },
    },
  ],
  waitlist: [
    {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
      requestedDate: {
        type: Date,
        required: true,
      },
      requestedTime: {
        type: String,
        required: true,
      },
    },
  ],
});


doctorSchema.pre("save", function (next) {
  const doctor = this;

  if (!doctor.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(doctor.password, salt, function (err, hash) {
      if (err) return next(err);
      doctor.password = hash;
      next();
    });
  });
});
doctorSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("Doctor", doctorSchema);
