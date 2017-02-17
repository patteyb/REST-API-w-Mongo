/** 
 * REVIEWS.JS
 *
 * @author: Pattey Bleecker
 * Date:    February 15, 2017
 * For:     teamTreehouse Project 11, Build a RESTful API
 * 
 * Reviews model schema
 */
'use strict';

const User = require('../models/users');
const Course = require('../models/courses');

const mongoose = require('mongoose');
const integerValidator = require('mongoose-integer');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
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
        required: [true, 'A rating is required.'],
        min: [1, 'Rating must be a number between 1 and 5.'],
        max: [5, 'Rating must be a number between 1 and 5.'],
        integer: 'Rating must be an integer between 1 and 5.'
    },
    review: {
        type: String
    }
});

// Round the rating to the nearest integer before saving
ReviewSchema.pre('save', function(next) {
    this.rating = Math.round(this.rating);
    next();
});

ReviewSchema.plugin(integerValidator);

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;