/** 
 * USERS.JS
 *
 * @author: Pattey Bleecker
 * Date:    February 15, 2017
 * For:     teamTreehouse Project 11, Build a RESTful API
 * 
 * Router for Users
 */
'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mid = require('../middleware');


// GET /api/users 200
// Returns the currently authenticated user
router.get('/users', mid.authenticate, function (req, res, next) {
    var validUser = {};
    validUser.data = [];
    validUser.data.push(req.user);
    res.json(validUser); 
});

/** POST /api/users 201
 * Creates a user        */
router.post('/users', function(req, res, next) {

    // If all fields are present
    if (req.body.emailAddress &&
        req.body.fullName &&
        req.body.password && 
        req.body.confirmPassword) {

        // confirm that two password fields match
        if (req.body.password !== req.body.confirmPassword) {
            var errorMessages = {
                message: 'Unmatched passwords',
                errors: [{ 
                    code: 400,
                    message: 'Password and Confirm Password do not match.'
                }]
            };
            return res.status(400).json(errorMessages);
        }

        // confirm that password is not already in use
        User.findOne({ emailAddress: req.body.emailAddress}, function(err, user) {
            if (user) {
                var errorMessages = {
                message: 'Duplicate Email',
                errors: [{ 
                    code: 400,
                    message: 'This email has an account already.'
                }]
            };
            return res.status(400).json(errorMessages);
            }
        });

        // All fields present and passes password validation, go ahead and save
        var user = new User(req.body);
        user.save(function(buggered, user) {
            // Check for error
            if (buggered) {
                if (buggered.name === 'ValidationError') {
                    var errorMessages = {
                        message: 'Validation Failed',
                        errors: {}
                    };
                    // Check for validation error 
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
            }
            // Saved new user with no errors
            res.status(201).send();
        });
    // else fields are missing
    } else {
        var errorMessages = {
            message: 'No Data',
            errors: [{ 
                code: 400,
                message: 'All fields are required.'
            }]
        };
        res.location('/');
        return res.status(400).json(errorMessages);
      }
});

// Unsupported http routes
router.put('/users', function (req, res, next) {
    return res.status(403).json('Cannot edit a collection of users.');
});

router.delete('/users', function (req, res, next) {
    return res.status(403).json('Cannot delete a collection of users.');
});

module.exports = router;
