const mongoose = require('mongoose');

const { Schema } = mongoose;

const institutionSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  CNPJ: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  CEP: {
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
  role: {
    type: String,
    default: 'admin',
  },
  confirmationCode: {
    type: String,
    default: '',
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
});

institutionSchema.methods.addInstitution = (institution) => {
  const {
    email, phone, CNPJ, address, CEP, password, confirmPassword, name,
  } = institution;
  this.email = email;
  this.phone = phone;
  this.CNPJ = CNPJ;
  this.address = address;
  this.CEP = CEP;
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.name = name;

  return this.save();
};

module.exports = mongoose.model('Institution', institutionSchema);
