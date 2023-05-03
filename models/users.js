const mongoose = require('mongoose');


const newuserSchema={
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must be at least 3 characters long']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [3, 'Last name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
};

const User = mongoose.model('User', newuserSchema);

module.exports = User;