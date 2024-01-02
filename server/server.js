const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/connectDb");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

//api routes
app.use('/api/doctor', require('./routes/doctor.route'));
app.use('/api/patient', require('./routes/patient.route'));

//mongoDB connection
connectDb();
app.listen(process.env.PORT, () => console.log(`App listening on ${process.env.PORT}!`));
