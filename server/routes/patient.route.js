const express = require('express');
const {createPatient, loginPatient, bookAppointment, cancelAppointment} = require('../controller/patient.controller');

const router = express.Router();

router.use('/signup',createPatient);
router.use('/login',loginPatient);
router.use('/book-appointment',bookAppointment);
router.use('/cancel-appointment',cancelAppointment);

module.exports= router;