const crypto = require('crypto');
const nodemailer = require('nodemailer');


const OTP = require('../models/Otp.model');


//helper functions
const generateOtp = (length = 6) => {
    return crypto.randomBytes(length).toString().substring(0,length);
}

const sendOtpEmail = async(email, otp) => {
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }
    
        console.log('Credentials obtained, sending message...');
    
        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
    
        // Message object
        let message = {
            from: 'BookMyDoc',
            to: email,
            subject: 'Nodemailer is unicode friendly ✔',
            text: 'Hello to myself!',
            html: `<p><b>Hello</b> to myself! The OTP is ${otp}</p>`
        };
    
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }
    
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}
exports.requestOtp = async (req,res) => {
    const {email, userType} = req.body;
    try{
    const otp = generateOtp();
    console.log(otp);
    const otpEntry = new OTP({email, userType, otp });
    await otpEntry.save();
    await sendOtpEmail(email, otp);
    res.status(200).send({ message: 'OTP sent successfully' });
}
catch(error){
    console.log(error);
    res.status(500).send({ error: `Error sending OTP: ${error}` });
}

}