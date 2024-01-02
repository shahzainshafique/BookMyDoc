const express = require('express');
const {createPatient, loginPatient} = require('../controller/patient.controller');

const router = express.Router();

router.use('/signup',createPatient);
router.use('/login',loginPatient);

module.exports= router;