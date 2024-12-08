const express = require("express");
const {
  createDoctor,
  loginDoctor,
  getTotalAppointments,
  fetchDoctorAppointments,
  rescheduleAppointment,
  cancelAppointment,
  createDocAppointment,
  createPatient,
  getPatientsByDoc,
  updateDoctorProfile,
  upload
} = require("../controller/doctor.controller");
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use("/signup", createDoctor);
router.use("/login", loginDoctor);
router.use("/get-appointments-count", verifyToken, getTotalAppointments);
router.use(
  "/update-doctor-profile/:doctorId",
  verifyToken,
  upload.single("image"),
  updateDoctorProfile
);
router.use("/get-all-patients/:doctorId", verifyToken, getPatientsByDoc);
router.use("/appointments/create", verifyToken, createDocAppointment);
router.use("/appointments/create-patient", verifyToken, createPatient);
router.use("/appointments/:doctorId", verifyToken, fetchDoctorAppointments);
router.use("/update-appointment", verifyToken, rescheduleAppointment);
router.use("/cancel-appointment", verifyToken, cancelAppointment);

module.exports = router;
