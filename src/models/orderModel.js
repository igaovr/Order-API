// src/models/orderModel.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true, // não deixa ter dois pedidos com o mesmo número
    index: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  creationDate: {
    type: Date,
    required: true
  },
  items: {
    type: [ItemSchema],
    default: []
  }
}, {
  timestamps: true 
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
