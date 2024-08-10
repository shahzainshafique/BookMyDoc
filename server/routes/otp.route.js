const express = require("express");
const { requestOtp, verifyOtp } = require("../controller/otp.controller");
const router = express.Router();

router.use("/request-otp", requestOtp);
router.use("/verify-otp", verifyOtp);

module.exports = router;
