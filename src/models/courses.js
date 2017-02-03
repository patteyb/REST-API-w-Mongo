'use strict';

var mongoose = require('mongoose');
var Review = require('../models/reviews');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        unique: true,
        required: [true, 'Title is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    estimatedTime: {
        type: String
    },
    materialsNeeded: {
        type: String
    },
    steps: [{
        stepNumber: Number,
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CourseSchema.virtual('overallRating').get(function() {
    var overallRating = 0;
    for( var i = 0; i < this.reviews.length; i++) {
        overallRating += this.reviews[i].rating;
    }
    overallRating = Math.round(overallRating / this.reviews.length);
    return overallRating;

});

var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;