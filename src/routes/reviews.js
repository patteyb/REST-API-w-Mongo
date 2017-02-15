/** 
 * Reviews.JS
 *
 * @author: Pattey Bleecker
 * Date:    February 15, 2017
 * For:     teamTreehouse Project 11, Build a RESTful API
 * 
 * Router for Reviews
 */
'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var Review = require('../models/reviews');
var mid = require('../middleware');

router.get('/reviews', function(req, res, next) {
    Review.find({}, function(err, reviews) {
        if (err) return next(err);
        var theReviews = {};
        theReviews.data = reviews;
        res.json(theReviews);
    });
});

/** POST /api/courses/:courseId/reviews
 * Creates a review   */
router.post('/courses/:courseId/reviews', mid.authenticate, function(req, res, next) {

    var review = new Review(req.body);

    // Find the user who is posting review
    review.user = req.user._id;
    var reviewsArray;

    // Retrieve the reviews of the course being reviewed
    Course.findOne({_id: req.params.courseId}, 'user reviews', function(err, course) {

        if (err) return next(err);

        var errorMessages = {};
        var alreadyReviewed = false;

        // Check if user has already posted a review
        for (var i = 0; i < course.reviews.length; i++) {
            if (review.user.equals(course.reviews[i].user)) {
                alreadyReviewed = true;
                i = course.reviews.length;
            }
        } 

        // Check if user is the course owner 
        var isCourseOwner = false;
        if (review.user.equals(course.user._id)) {
            isCourseOwner = true;
        }

        if (alreadyReviewed) {
            var errorMessages = {
                message: 'Validation Failed',
                errors: {}
            };
            errorMessages = {
                    message: 'Duplicate Review',
                    errors: [{ 
                        code: 400,
                        message: "You're not allowed to review a course twice!"
                    }]
                };
                return res.status(400).json(errorMessages);
        } else if (isCourseOwner) {
            var errorMessages = {
                message: 'Validation Failed',
                errors: {}
            };
            errorMessages = {
                    message: 'Not allowed to Review',
                    errors: [{ 
                        code: 400,
                        message: "You're not allowed to review your own course!"
                    }]
                };
                return res.status(400).json(errorMessages);
        } else { 

            // Store the review id with the course's review array
            course.reviews.push(review);
            // And save it
            course.save(function(buggered) {
                if (buggered) {
                    var errorMessages = {
                        message: 'Validation Failed',
                        errors: {}
                    };
                    // Check for validation error 
                    if (buggered.name === 'ValidationError') {
                        for (var error in buggered.errors) {
                            errorMessages.errors[error] = [{
                                code: 400,
                                message: buggered.errors[error].message
                            }];
                        }
                        return res.status(400).json(errorMessages);
                    // Pass on error to error handler
                    } else {
                        return next(buggered);
                    }
                } else {
                    // Now save the review to the review collection
                    review.save(function(err, review) {
                        if(err) return next(err);
                        res.status(201);
                        res.json(review);
                    });
                }
            });
        }
    });
});

/** DELETE /api/courses/:courseId/reviews/:id
 *  Deletes the specified review            */
router.delete('/courses/:courseId/reviews/:reviewId', mid.authenticate, function(req, res, next) {

    var reviewId = req.params.reviewId;
    var userId = req.user._id;

    Course.findOne({_id: req.params.courseId}, 'user reviews', function(err, course) {
        if (err) return next(err);
        
        // Get index of review to be deleted
        var index = -1;
        for (var i = 0; i < course.reviews.length; i++) {
            if (course.reviews[i]._id.equals(reviewId)) {
                index = i;
            }
        }

        // Check to see that the user is the course owner or the review owner
        if (index !== -1) {
            var canDelete = true;
            if (course.reviews[index].user !== req.user._id ||
                !course.user._id.equals(req.user._id)) {
                    canDelete = false;
                    var errorMessages = {
                        message: 'Denied Access',
                        errors: [{ 
                            code: 400,
                            message: 'You cannot delete this review.'
                        }]
                    };
                    return res.status(400).json(errorMessages);
            } else {

                // Remove the review from the course's review array
                if (canDelete && index > -1) {
                    course.reviews.splice(index, 1);
            
                    // And save it
                    course.save(function(err) {
                        if (err) return next(err);
                    });

                    // Now delete the review from review collection
                    Review.findOne({_id: id}).remove().exec(function(err) {
                        if(err) return next(err);
                        res.location('/courses');
                        res.status(204).send(null);
                    });
                }
            }
        } else {
            return res.status(400).json('Review not found.');
        }
    });  
});

// Unsupported http routes
router.put('/courses/:courseId/reviews', function (req, res, next) {
    return res.status(403).json('Cannot edit a collection of reviews.');
});

router.delete('/courses/:courseId/reviews', function (req, res, next) {
    return res.status(403).json('Cannot delete  a collection of reviews.');
});

router.get('/courses/:courseId/reviews/:id', function (req, res, next) {
    return res.status(403).json("Cannot get a single review. Use the '/api/courses/:id' route instead to get the reviews for a specific course.");
});

router.post('/courses/:courseid/reviews/:id', function (req, res, next) {
    res.set('Allow', 'DELETE');
    return res.status(405).json("Use the '/api/courses/:courseId/reviews' route to create a review.");
    //res.Allow = "GET, PUT";
});

router.put('/courses/:courseid/reviews/:id', function (req, res, next) {
    return res.status(403).json("Cannot edit a review.");
});


module.exports = router;