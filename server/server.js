const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/connectDb");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

//api routes
app.use('/',(req,res)=>res.send('Hellow'));

//mongoDB connection
connectDb();
app.listen(process.env.PORT, () => console.log(`App listening on ${process.env.PORT}!`));
