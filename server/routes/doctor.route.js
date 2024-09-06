const express = require("express");
const {
  createDoctor,
  loginDoctor,
  getTotalAppointments,
} = require("../controller/doctor.controller");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use("/signup", createDoctor);
router.use("/login", loginDoctor);
router.use("/get-appointments-count", verifyToken, getTotalAppointments);

module.exports = router;
