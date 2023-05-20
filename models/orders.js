const mongoose = require('mongoose');
const shortid = require('shortid');

const orderSchema ={
  orderNumber:{
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  number: {
    type: String,
  },
  email: {
    type: String,
  },
  add1: {
    type: String,
  },
  add2: {
    type: String,
  },
  city: {
    type: String,
  },
  zip: {
    type: String,
  },
  createAccount: {
    type: Boolean,
  },
  message: {
    type: String,
  },
  total: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
  },
  shippingCost: {
    type: Number,
  },
  products: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  trackingNumber: {
    type: String,
    default: shortid.generate,
    unique: true
  }
};


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
