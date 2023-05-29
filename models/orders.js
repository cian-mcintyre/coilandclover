const mongoose = require('mongoose');
const shortid = require('shortid');

const orderSchema ={
  orderNumber:{
    type: String,
    
  },
  firstName: {
    type: String,
    required: true,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: true,
    required: [true, 'Last name is required'],
  },
  number: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{3}-\d{3}-\d{4}$/, 'Phone number is not valid'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address`
    }
  },
  add1: {
    type: String,
    required: [true, 'Address line 01 is required'],
  },
  add2: {
    type: String,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  zip: {
    type: String,
    required: [true, 'Eircode is required'],
    match: [/^[A-Z0-9]{7}$/, 'Eircode is not valid'],
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
  cartItems: [
    {
      name: { type: String, required: true },
    },
  ],
  trackingNumber: {
    type: String,
    default: shortid.generate,
    unique: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
};


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
