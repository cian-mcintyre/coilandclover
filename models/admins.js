const mongoose = require('mongoose');


const newadminSchema={
    username: {
        type: String,
        required: [true, 'username is required'],
        minlength: [3, 'username must be at least 3 characters long']
    },
    
    
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
};

const Admin = mongoose.model('Admin', newadminSchema);

module.exports = Admin;