const mongoose = require('mongoose');

const { Schema } = mongoose;

const flowerSchema = new Schema({
  lote: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
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
    category,
    description,
    price,
    quantity,
    userId,
  } = flower;
  this.lote = lote;
  this.category = category;
  this.description = description;
  this.price = price;
  this.quantity = quantity;
  this.userId = userId;

  return this.save();
};

module.exports = mongoose.model('flower', flowerSchema);
