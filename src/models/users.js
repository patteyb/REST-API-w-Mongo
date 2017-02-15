/** 
 * USERS.JS
 *
 * @author: Pattey Bleecker
 * Date:    February 15, 2017
 * For:     teamTreehouse Project 11, Build a RESTful API
 * 
 * Users model schema
 */
'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Review = require('../models/reviews');


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required.']
    },
    emailAddress: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return validator.isEmail(v);
            },
            message: '{VALUE} is not a valid email.'
        },
        required: [true, 'Email is required.'],
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


// hash password before saving to database 
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.genSalt(10, function(err, salt) {
        if (err) next(err);
        user.salt = salt;
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) next(err);
            user.password = hash;
            next();
        });
    });
});
    

var User = mongoose.model('User', UserSchema);
module.exports = User;