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
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

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

CourseSchema.pre('init', function(next, data) {
    Course.populate(data, {
        path: 'reviews user' 
    }, function(err, course) {
        data = course;
        next();
    });
});

CourseSchema.path('steps').validate(function(steps) {
    if (!steps || steps.length === 0) {
        return false;
    } else {
        return true;
}}, 'Courses need to have at least one step.');


var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;