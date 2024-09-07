const express = require("express");
const {
  createDoctor,
  loginDoctor,
  getTotalAppointments,
  fetchDoctorAppointments,
} = require("../controller/doctor.controller");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use("/signup", createDoctor);
router.use("/login", loginDoctor);
router.use("/get-appointments-count", verifyToken, getTotalAppointments);
router.use("/appointments/:doctorId", verifyToken, fetchDoctorAppointments);

module.exports = router;
