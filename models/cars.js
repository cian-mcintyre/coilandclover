const mongoose = require('mongoose');

const carSchema = {
    productName: String,
    image: String,
    category: String,
    colour: String,
    Quantity: String,
    Price: String,
    Page: String
}

const Car = mongoose.model('Car', carSchema);


module.exports = Car;