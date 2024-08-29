const express = require('express');
const {createPatient, loginPatient, bookAppointment} = require('../controller/patient.controller');

const router = express.Router();

router.use('/signup',createPatient);
router.use('/login',loginPatient);
router.use('/book-appointment',bookAppointment);

module.exports= router;