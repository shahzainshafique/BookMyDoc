const mongoose = require('mongoose');

const otpScehma = mongoose.Schema({
    email: String,
    userType: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires:300 }
});

const OTP = mongoose.model('OTP', otpScehma);

module.exports = OTP;