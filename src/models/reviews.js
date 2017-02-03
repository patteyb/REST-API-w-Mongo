'use strict';

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
        required: [true, 'Please enter a number between 1 and 5.']
    },
    review: {
        type: String
    }
});

var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;