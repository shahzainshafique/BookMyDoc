const express = require("express");
const {
  createDoctor,
  loginDoctor,
  getTotalAppointments,
} = require("../controller/doctor.controller");

const router = express.Router();

router.use("/signup", createDoctor);
router.use("/login", loginDoctor);
router.use("/get-appointments-count", getTotalAppointments);

module.exports = router;
