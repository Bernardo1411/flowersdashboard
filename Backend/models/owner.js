const mongoose = require('mongoose');

const { Schema } = mongoose;

const ownerSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  CEP: {
    type: String,
    required: true,
  },
  CNPJ: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  openBRState: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
});

ownerSchema.methods.addOwner = (owner) => {
  const {
    email,
    phone,
    address,
    CEP,
    CNPJ,
    name,
    city,
  } = owner;
  this.email = email;
  this.phone = phone;
  this.address = address;
  this.name = name;
  this.CNPJ = CNPJ;
  this.CEP = CEP;
  this.city = city;

  return this.save();
};

module.exports = mongoose.model('Owner', ownerSchema);
