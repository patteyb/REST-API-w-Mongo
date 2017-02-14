'use strict';

var User = require('../models/users');
var Course = require('../models/courses');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        required: [true, 'Please enter a number between 1 and 5.'],
        min: [1, 'Rating must be a number between 1 and 5.'],
        max: [5, 'Rating must be a number between 1 and 5.']
    },
    review: {
        type: String
    }
});

/*
ReviewSchema.pre('init', function(next, data) {
    Review.populate(data, {
        path: 'user' 
    }, function(err, review) {
        data = review;
        next();
    });
});
*/
ReviewSchema.pre('save', function(next) {
    this.rating = Math.round(this.rating);
    next();
});

//ReviewSchema.index({ user: 1, course._id: 1 }, { unique: true });

var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;