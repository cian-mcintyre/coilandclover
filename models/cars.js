const mongoose = require('mongoose');

const carSchema = {
    productName: String,
    image: String,
    category: String,
    colour: String,
    Quantity: Number,
    Price: Number,
    Page: String
}

const Car = mongoose.model('Car', carSchema);


module.exports = Car;