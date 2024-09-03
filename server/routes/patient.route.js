const express = require('express');
const {createPatient, loginPatient, bookAppointment, cancelAppointment} = require('../controller/patient.controller');
const { getTotalAppointments } = require('../controller/doctor.controller');

const router = express.Router();

router.use('/signup',createPatient);
router.use('/login',loginPatient);
router.use('/book-appointment',bookAppointment);
router.use('/cancel-appointment',cancelAppointment);
router.use('/get-appointments',getTotalAppointments);

module.exports= router;