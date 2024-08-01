const express = require('express');
const { requestOtp } = require('../controller/otp.controller');
const router = express.Router();

router.use('/request-otp', requestOtp)

module.exports = router;