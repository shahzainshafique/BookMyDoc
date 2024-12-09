const express = require("express");
const { createAdmin, loginAdmin } = require("../controller/admin.controller");

const router = express.Router();

router.use("/signup", createAdmin);
router.use("/login", loginAdmin);

module.exports = router;
