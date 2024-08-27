const Patient = require("../models/Patients.model");

//create new Patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    return res.status(200).send(patient);
  } catch (exp) {
    res.sendStatus(500);
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email });
    if (!patient) {
      return res.status(400).send({ error: "User not found" });
    }
    patient.comparePassword(req.body.password, (err, isMatch) => {
      if (!!err || !!isMatch) {
        console.log(err);
        return res.status(400).send({ error: err });
      }
      res.status(201).send(patient);
    });
  } catch (exp) {
    console.log(exp);
    res.status(500).send(exp);
  }
};
