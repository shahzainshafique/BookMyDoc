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
  isGuest: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    lowercase: true,
    validate: {
      validator: function (v) {
        return this.isGuest || (v && v.length > 0); // Email is required only if not a guest
      },
      message: "Email is required for non-guest users.",
    },
  },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        return this.isGuest || (v && v.length > 0); // Password is required only if not a guest
      },
      message: "Password is required for non-guest users.",
    },
  },
  appointments: [
    {
      appointmentId: {
        type: String,
      },
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
      appointmentDate: {
        type: Date,
      },
      appointmentTime: {
        type: String,
      },
      appointmentLocation: {
        type: String,
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
