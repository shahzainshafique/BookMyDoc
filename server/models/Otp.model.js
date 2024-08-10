const mongoose = require("mongoose");

const otpScehma = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  userType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" },
});

const OTP = mongoose.model("OTP", otpScehma);

module.exports = OTP;
