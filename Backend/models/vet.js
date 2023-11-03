const mongoose = require('mongoose');

const { Schema } = mongoose;

const vetSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
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
  surname: {
    type: String,
    required: true,
  },
  CPF: {
    type: String,
    required: true,
  },
  CRMV: {
    type: String,
    required: true,
  },
  instId: {
    type: mongoose.ObjectId,
    required: true,
  },
  role: {
    type: String,
    default: 'vet',
  },
});

vetSchema.methods.addVet = (vet) => {
  const {
    email,
    phone,
    password,
    name,
    surname,
    CRMV,
    CPF,
  } = vet;
  this.email = email;
  this.phone = phone;
  this.password = password;
  this.name = name;
  this.surname = surname;
  this.CRMV = CRMV;
  this.CPF = CPF;

  return this.save();
};

module.exports = mongoose.model('Vet', vetSchema);
