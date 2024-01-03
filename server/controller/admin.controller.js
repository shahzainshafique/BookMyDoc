const Admin = require('../models/Admin.model');

exports.createAdmin = async(req,res)=>{
    try {
    const admin = new Admin(req.body);
    await admin.save();
    return res.status(200).send(admin);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.loginAdmin = async(req,res)=>{
    try{
        const admin = await Admin.findOne({email: req.body.email});
        if(!admin){
            return res.status(400).send({error: "No admin found with the provided email!"});
        }
        admin.comparePassword(req.body.password,(err,isMatch)=>{
            if(!!err||!isMatch){
                return res.status(401).send({error:'Wrong Password!'});
            }
            res.send(admin);
        })
    }catch(error){
        res.status(500).send(error);
    }
}