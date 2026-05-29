const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        trim: true,
        unique: true,
    },

    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a vaild email'
        ]
    },

    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);