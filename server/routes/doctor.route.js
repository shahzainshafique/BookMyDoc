const express = require("express");
const {
  createDoctor,
  loginDoctor,
  getTotalAppointments,
  fetchDoctorAppointments,
  rescheduleAppointment,
  cancelAppointment,
} = require("../controller/doctor.controller");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use("/signup", createDoctor);
router.use("/login", loginDoctor);
router.use("/get-appointments-count", verifyToken, getTotalAppointments);
router.use("/appointments/:doctorId", verifyToken, fetchDoctorAppointments);
router.use("/update-appointment", verifyToken, rescheduleAppointment);
router.use("/cancel-appointment", verifyToken, cancelAppointment);

module.exports = router;
