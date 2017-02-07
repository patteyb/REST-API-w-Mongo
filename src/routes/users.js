'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mid = require('../middleware');

// GET /signin
router.get('/signin', function(req, res, next) {
  return res.render('sign-in');
});

// POST /login
router.post('/signin', mid.authenticate, function(req, res, next) {

  if (req.body.emailAddress && req.body.password) {
      console.log('IN POST SIGNIN ROUTER: ', req.body);
      console.log('Retrieved user: ', req.user);
      if (!req.user) {
        var err = new Error('Wrong email or password');
        err.status = 401;
        return next(err)
      } else {
        //req.session.userId = user._id;   // Express creates a session!
        return res.redirect(200, '/courses');
      }
  } else {
    var err = new Error('Email and password are required'); 
  }
});

/** GET /api/users 200 */
/*router.get('/users', function(req, res, next) {
    console.log('IN USERS ROUTER: ', req.body);
    User.find({}, function(err, users) {
        if(err) return next(err);
        var theUsers = {};
        theUsers.data = users;
        //console.log('USERS: ', theUsers);
        res.json(theUsers);
    });
}); */

/** POST /api/users
 * Creates a user        */
router.post('/users', function(req, res, next) {
    if (req.body.emailAddress &&
        req.body.fullName &&
        req.body.password && 
        req.body.confirmPassword) {

        // confirm that two password fields match
        if (req.body.password !== req.body.confirmPassword) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);
        }

        var user = new User(req.body);
        user.save(function(err, user) {
            if(err) return next(err);
            //res.location('/');
            //res.send(201, null);
            res.status(201);
            res.json(user);
        });
    } else {
        var err = new Error('All fields required');
        err.status = 400;  // bad request
        return next(err);
      }
});

module.exports = router;
