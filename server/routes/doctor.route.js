const express = require('express');
const {createDoctor, loginDoctor} = require('../controller/doctor.controller');

const router = express.Router();

router.use('/signup',createDoctor);
router.use('/login',loginDoctor);

module.exports = router;