'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
//var User = require('../models/users');
var Review = require('../models/reviews');

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
router.post('/courses/:courseId/reviews', function(req, res, next) {
    var review = new Review(req.body);
    // Capture user once we wire up user authentication

    // Post the review to the proper course 
    Course.findOne({_id: req.params.courseId}, function(err, course) {
        if (err) return next(err);

        // Store the review id with the course's review array
        course.reviews.push(review);
        // And save it
        course.save(function(err) {
            if (err) return next(err);
        });
    });  
    // Now save the review to the review collection
    review.save(function(err, review) {
        if(err) return next(err);
        //res.location('/courses/' + course._id);
        //res.send(201, null); 
        res.status(201);
        res.json(review);
    });
});

/** DELETE /api/courses/:courseId/reviews/:id
 *  Deletes the specified review            */
router.delete('/courses/:courseId/reviews/:reviewId', function(req, res, next) {
    var id = req.params.reviewId;
    Course.findOne({_id: req.params.courseId}, function(err, course) {
        if (err) return next(err);

        // Remove the review from the course's review array
        var index = course.reviews.indexOf(id);
        if (index > -1) {
            course.reviews.splice(index, 1);
        }
        // And save it
        course.save(function(err) {
            if (err) return next(err);
        });
    });  
    // Now delete the review from review collection
    Review.findOne({_id: id}).remove().exec(function(err) {
        if(err) return next(err);
        res.location('/courses');
        res.send(204, null); 
        //res.status(201);
       // res.json(review);
    });
    
    /**/

});

module.exports = router;