const express = require("express");
const cors = require("cors");
const path = require("path");

const { connectDb } = require("./config/connectDb");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files (images) from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//api routes
app.use('/api/doctor', require('./routes/doctor.route'));
app.use('/api/patient', require('./routes/patient.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.use('/api/otp', require('./routes/otp.route'));

//mongoDB connection
connectDb();
app.listen(process.env.PORT, () => console.log(`App listening on ${process.env.PORT}!`));
