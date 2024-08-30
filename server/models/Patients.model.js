const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const patientSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  appointments: [
    {
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
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
});

patientSchema.pre("save", function (next) {
  const patient = this;

  if (!patient.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(patient.password, salt, function (err, hash) {
      if (err) return next(err);
      patient.password = hash;
      next();
    });
  });
});
patientSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("Patient", patientSchema);
