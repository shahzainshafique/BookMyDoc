const express = require("express");
const {
  createPatient,
  loginPatient,
  bookAppointment,
  cancelAppointment,
  reScheduleAppointment,
  getPatientAppointments,
} = require("../controller/patient.controller");
const { getAllDoctors } = require("../controller/doctor.controller");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use("/signup", createPatient);
router.use("/login", loginPatient);
router.use("/doctors", verifyToken, getAllDoctors);
router.use("/book-appointment", verifyToken, bookAppointment);
router.use("/cancel-appointment", verifyToken, cancelAppointment);
router.use("/get-appointments", verifyToken, getPatientAppointments);
router.use("/update-appointment", verifyToken, reScheduleAppointment);

module.exports = router;
