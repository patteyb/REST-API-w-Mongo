'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var User = require('../models/users');
var Review = require('../models/reviews');
var mid = require('../middleware');

router.param('courseId', function(req, res, next, id) {
    Course.findById(id, function(err, course) {
        if(err) return next(err);
        if(!course) {
            err = new Error('Course not found.');
            err.status = 404;
            return next(err);
        }
        req.course = (course);
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

    User.populate(req.course, [{path: 'reviews.user'}, {path: 'user'}], function(err, course) {
        if (err) return next(err); 
        // format data for angular
        var theCourse = {};
        theCourse.data = [];
        theCourse.data.push(req.course);
        res.json(theCourse);
    });
});

/** POST /api/courses
 * Creates a course        */
router.post('/courses', mid.authenticate, function(req, res, next) {
    var course = new Course(req.body);
    course.save(function(buggered) {
        if (buggered) {
            var errorMessages = {
                message: 'Validation Failed',
                errors: {}
            };
            if (buggered.name === 'ValidationError') {
                for (var error in buggered.errors) {
                    var msg = '';
                    var arr = error.split('.');
                    if ( arr[0] === 'description') {
                        msg = 'Course description is required ';
                    } else if ( arr[0] === 'title') {
                        msg = 'Course title is required.';
                    } else if ( arr[0] === 'steps' && arr.length === 1) {
                        msg = 'You must provide at least one step.';
                    } else if ( arr[0] === 'steps' && arr.length === 3) {
                        var stepNum = parseInt(arr[1])+1;
                        msg = 'Step ' + stepNum + ' ' + arr[2] + ' is required.';
                    }
                    errorMessages.errors[error] = [{
                        code: 400,
                        message: msg
                    }];
                }
                console.log(errorMessages);
                return res.status(400).json(errorMessages);
            } else {
                return next(buggered);
            }
        }
        res.location('/courses/' + course._id);
        res.status(201);
        res.end();
    });
});

/** PUT /api/courses/:id
 * Update a course        */
router.put('/courses/:courseId', mid.authenticate, function(req, res, next) {
    console.log("In UPDATE ROUTER");
    req.course.update(req.body, {runValidators: true}, function(buggered, course) {
        console.log('buggered: ', buggered);
        if (buggered) {
            var errorMessages = {
                message: 'Validation Failed',
                errors: {}
            };
            if (buggered.name === 'ValidationError') {
                for (var error in buggered.errors) {
                    var msg = '';
                    var arr = error.split('.');
                    if ( arr[0] === 'description') {
                        msg = 'Course description is required ';
                    } else if ( arr[0] === 'title') {
                        msg = 'Course title is required.';
                    } else if ( arr[0] === 'steps' && arr.length === 1) {
                        msg = 'You must provide at least one step.';
                    } else if ( arr[0] === 'steps' && arr.length === 3) {
                        var stepNum = parseInt(arr[1])+1;
                        msg = 'Step ' + stepNum + ' ' + arr[2] + ' is required.';
                    }
                    errorMessages.errors[error] = [{
                        code: 400,
                        message: msg
                    }];
                }
                console.log(errorMessages);
                return res.status(400).json(errorMessages);
            } else {
                return next(buggered);
            }
        }
        res.location('/courses/' + course._id);
        res.status(201);
        res.end();
    });
});

// Unsupported http routes
router.put('/courses', function (req, res, next) {
    return res.status(403).json('Cannot edit a collection of courses.');
});

router.delete('/courses', function (req, res, next) {
    return res.status(403).json('Cannot delete a collection of courses.');
});

router.post('/courses/:id', function (req, res, next) {
    res.set('Allow', 'GET, PUT');
    return res.status(405).json("Use the '/api/courses' route to create a course.");
});

router.delete('/courses/:id', function (req, res, next) {
    return res.status(403).json("Cannot delete a course.");
});

module.exports = router;