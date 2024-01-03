const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});
adminSchema.pre("save", function (next) {
    const admin = this;
  
    if (!admin.isModified("password")) return next();
  
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
  
      bcrypt.hash(admin.password, salt, function (err, hash) {
        if (err) return next(err);
        admin.password = hash;
        next();
      });
    });
  });
adminSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

module.exports = mongoose.model('Admin', adminSchema);
 
