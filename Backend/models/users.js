const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

userSchema.methods.addUser = (user) => {
  const {
    email, password, confirmPassword, name,
  } = user;
  this.email = email;
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.name = name;

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
