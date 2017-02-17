/** 
 * COURSES.JS
 *
 * @author: Pattey Bleecker
 * Date:    February 15, 2017
 * For:     teamTreehouse Project 11, Build a RESTful API
 * 
 * Course model schema
 */
'use strict';

const mongoose = require('mongoose');
const Review = require('../models/reviews');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        unique: [true, 'A course with that title already exists.'],
        required: [true, 'Title is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    estimatedTime: String,
    materialsNeeded: String,
    steps: [{
        stepNumber: Number,
        title: {
            type: String,
            required: [true, 'A title is required.']
        },
        description: {
            type: String,
            required: [true, 'A description is required.']
        }
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

// Compute average of all the review ratings
CourseSchema.virtual('overallRating').get(function() {
    var overallRating = 0;
    if (this.reviews) {
        for( var i = 0; i < this.reviews.length; i++) {
            overallRating += this.reviews[i].rating;
        }
        overallRating = Math.round(overallRating / this.reviews.length);
    }
    return overallRating;
});

// Validate that there is at least one step provided before saving
CourseSchema.path('steps').validate(function(steps) {
    if (!steps || steps.length === 0) {
        return false;
    } else {
        return true;
}}, 'Courses need to have at least one step.');

// Increment stepNumber, beginning with 1, before saving
CourseSchema.pre('save', function(next) {
    for (var i = 0; i < this.steps.length; i++) {
        this.steps[i].stepNumber = i + 1;
    }
    next();
});


var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;