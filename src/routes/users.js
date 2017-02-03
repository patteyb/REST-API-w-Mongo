'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/users');

/** GET /api/users 200 */
router.get('/users', function(req, res, next) {
    User.find({}, '_id fullName', function(err, users) {
        if(err) return next(err);
        var theUsers = {};
        theUsers.data = users;
        res.json(theUsers);
    });
});

/** POST /api/users
 * Creates a user        */
router.post('/users', function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err, user) {
        if(err) return next(err);
        //res.location('/');
        //res.send(201, null);
        res.status(201);
        res.json(user);
    });
});

module.exports = router;
