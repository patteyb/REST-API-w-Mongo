'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var User = require('../models/users');
var Review = require('../models/reviews');

router.param('courseId', function(req, res, next, id) {
    Course.findById(id)
        .populate('reviews')
        .populate('user')
        .exec(function(err, course) {
            if(err) return next(err);
            if(!course) {
                err = new Error('Course not found.');
                err.status = 404;
                return next(err);
            }
            req.course = (course);
            //req.course.overallRating = course.avgRating;
            //console.log('req.course.overallRating: ', req.course.overallRating);
            return next();
        });
});

/** GET /api/courses
 * Returns all courses      */
router.get('/courses', function(req, res, next) {
    Course.find({}, '_id title', function(err, courses) {
        if(err) return next(err);
        var theCourses = {};
        theCourses.data = courses;
        res.json(theCourses);
    });
});

/** GET /api/courses/:id
 * Returns one course     */
router.get('/courses/:courseId', function(req, res, next) {
    // format data for angular
    var theCourse = {};
    console.log(req.course.overallRating + ', ' + req.course.estimatedTime);
    theCourse.data = [];
    theCourse.data.push(req.course);
    console.log(theCourse.data[0]);
    res.json(theCourse);
});

/** POST /api/courses
 * Creates a course        */
router.post('/courses', function(req, res, next) {
    var course = new Course(req.body);
    course.save(function(err, course) {
        if(err) return next(err);
        //res.location('/courses/' + course._id);
        //res.send(201, null);
        res.status(201);
        res.json(course);
    });
});

/** GET /api/courses/:id
 * Update a course        */
router.put('/courses/:courseId', function(req, res, next) {
    req.course.update(req.body, function(err, result) {
        if(err) return next(err);
        res.json(result);
    });
});


/** POST /api/courses/:courseId/reviews
 * Creates a review for a specified course 
router.post('/courses/:courseId/reviews', function(req, res, next) {
    req.course.reviews.push(req.body);
    req.course.save(function(err, course) {
        if(err) return next(err);
        res.status(201);
        res.json(course);
    });
}); */

module.exports = router;