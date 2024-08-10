const crypto = require("crypto");
const nodemailer = require("nodemailer");

const OTP = require("../models/Otp.model");

//helper functions
const generateOtp = (length = 6) => {
  return crypto.randomInt(1000, 10000).toString();
};

const sendOtpEmail = async (email, otp) => {
  console.log("Credentials obtained, sending message...");

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "",
      pass: "",
    },
  });

  // Message object
  let message = {
    from: "BookMyDoc",
    to: email,
    subject: "Nodemailer is unicode friendly ✔",
    text: "Hello to myself!",
    html: `<p><b>Hello</b> to myself! The OTP is ${otp}</p>`,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return process.exit(1);
    }

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
};
exports.requestOtp = async (req, res) => {
  const { email, userType } = req.body;
  try {
    const otp = generateOtp();
    console.log(otp);
    const otpEntry = new OTP({ email, userType, otp });
    await otpEntry.save();
    // await sendOtpEmail(email, otp);
    res.status(200).send({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: `Error sending OTP: ${error}` });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpFound = await OTP.findOne({ email });

    if (!otpFound) {
      return res.status(400).send({ message: "OTP not found for this email!" });
    }
    const isMatched = otpFound.otp == otp;
    if (!isMatched) {
      return res.status(401).send({ message: "Incorrect OTP!" });
    }

    res.status(200).send({ message: "OTP Verified successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
