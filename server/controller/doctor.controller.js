const Doctor = require('../models/Doctors.model');

exports.createDoctor = async(req,res)=>{
    try {
    const doctor = new Doctor(req.body);
    console.log('doc',doctor);
    await doctor.save();
    return res.status(200).send(doctor);
    } catch (error) {
        console.log('ere',error)
        res.status(500).send(error);
    }
}

exports.loginDoctor = async(req,res)=>{
    try{
        const doctor = await Doctor.findOne({email: req.body.email});
        if(!doctor){
            return res.status(400).send({error: "No doctor found with the provided email!"});
        }
        doctor.comparePassword(req.body.password,(err,isMatch)=>{
            if(!!err||!isMatch){
                return res.status(401).send({error:'Wrong Password!'});
            }
            res.send(doctor);
        })
    }catch(error){
        res.status(500).send(error);
    }
}