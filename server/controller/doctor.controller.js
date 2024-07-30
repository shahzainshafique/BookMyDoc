const Doctor = require("../models/Doctors.model");

exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    return res.status(200).send(doctor);
  } catch (error) {
    console.log("ere", error);
    if (error.code === 11000){
        res.status(409).send({error:"Email already exists!"});
    }
    res.status(500).send(error);
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.body.email });
    console.log("login", doctor);
    if (!doctor) {
      return res
        .status(400)
        .send({ error: "No doctor found with the provided email!" });
    }
    doctor.comparePassword(req.body.password, (err, isMatch) => {
      if (!!err || !isMatch) {
        console.log("in here");
        return res.status(401).send({ error: "Wrong Password!" });
      }
      return res.status(200).send(doctor);
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
