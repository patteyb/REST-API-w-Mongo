/** 
 * COURSES.JS
 *
 * @author: Pattey Bleecker
 * Date:    February 15, 2017
 * For:     teamTreehouse Project 11, Build a RESTful API
 * 
 * Router for Courses
 */
'use strict';

const express = require('express');
const router = express.Router();
const Course = require('../models/courses');
const User = require('../models/users');
const Review = require('../models/reviews');
const mid = require('../middleware');

// Anytime a courseId comes in on the request, find a course with that id
// use in GET /courses/:id and PUT /courses/:id

router.param('courseId', function(req, res, next, id) {
    //console.log("IN PARAM ROUTER: ", id);
   Course.findOne({ _id: id })
    //.lean()
    .populate( 'user', 'fullName' ) 
    //.lean()
    .populate({ path: 'reviews', model: 'Review', populate: {path: 'user', model: 'User', select: 'fullName'}})
    .exec(function(err, course) {
        if(err) return next(err);
        if(!course) {
            err = new Error('Course not found.');
            err.status = 404;
            return next(err);
        }
        //console.log('FOUND: ', course);
        req.course = course;
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
        theCourse.data = [];
        theCourse.data.push(req.course.toJSON({ virtuals: true }));
        res.json(theCourse);
    });

/** POST /api/courses
 * Creates a course        */
router.post('/courses', mid.authenticate, function(req, res, next) {
    var course = new Course(req.body);
    // I use 'buggered' here because I was getting confuses between err, error and errors
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

    Course.update({ _id: req.course._id }, req.body, {runValidators: true}, function(buggered) {

        if (buggered) {
            if (buggered.name === 'ValidationError') {
                var errorMessages = {
                    message: 'Validation Failed',
                    errors: {}
                };
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
                return res.status(400).json(errorMessages);
            } else {
                return next(buggered);
            }
        }
        res.status(204);
        res.location('/courses/');
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