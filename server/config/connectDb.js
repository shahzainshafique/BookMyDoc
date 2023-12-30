const mongoose = require("mongoose");

exports.connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Database connected successfully!");
  } catch (error) {
    console.log("MongoDB connection failure!", error);
  }
};
