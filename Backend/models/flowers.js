const mongoose = require('mongoose');

const { Schema } = mongoose;

const flowerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lote: {
    type: String,
    required: true,
  },
  validity: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
});

flowerSchema.methods.addUser = (flower) => {
  const {
    lote,
    validity,
    description,
    price,
    quantity,
    userId,
  } = flower;
  this.lote = lote;
  this.validity = validity;
  this.description = description;
  this.price = price;
  this.quantity = quantity;
  this.userId = userId;

  return this.save();
};

module.exports = mongoose.model('flower', flowerSchema);
