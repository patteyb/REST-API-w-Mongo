var bcrypt = require('bcryptjs');
var User = require('../models/users');

function authenticate(req, res, next) {
    //console.log('IN AUTHENTICATION, ', req.body);
    User.findOne({ emailAddress: req.body.emailAddress }, function(err, user) {
        if(err) {
            var err = new Error('This email is not valid');
            err.status = 401;
            return next(err);
        }
        req.user = user;
        //console.log('IN AUTHENTICATION, ', req.user.password, ', ', req.body.password);
        bcrypt.compare(req.body.password, req.user.password, function(err, isMatch) {
            //console.log('IN AUTHENTICATION, ismatch= ', isMatch);
            if (err || !isMatch) {
                var err = new Error('Invalid password.');
                err.status = 401;
                return next(err);
            }
            return next();     
        });
    });
}

module.exports.authenticate = authenticate;