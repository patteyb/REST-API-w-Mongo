'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required.']
    },
    emailAddress: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(v);
            },
            message: '{VALUE} is not a valid email.'
        },
        required: [true, 'Email is required.'],
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
    } /*, 
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
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// hash password before saving to database 
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if(err) {
            return next(err);
        } 
        user.password = hash;
        console.log("password: ", user.password);
        next();
    });
}); 

var User = mongoose.model('User', UserSchema);
module.exports = User;