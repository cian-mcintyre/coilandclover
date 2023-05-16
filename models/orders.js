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
  total: {
    type: Number,
    required: true,
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
