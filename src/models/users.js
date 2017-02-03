'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required.']
    },
    emailAddress: {
        type: String,
        unique: true,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }
    /*hashPassword: {
        type: String,
        required: true
    } */
});

var User = mongoose.model('User', UserSchema);
module.exports = User;