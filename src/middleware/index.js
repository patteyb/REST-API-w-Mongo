var bcrypt = require('bcryptjs');
var User = require('../models/users');
var auth = require('basic-auth');

function authenticate(req, res, next) {
    console.log('IN AUTHENTICATION');

    // Parse the authorization header. If header is invalide,
    // undefined is returned, else object with name and pass properties 
    // is returned
    var userLogin = auth(req);

    User.findOne({ emailAddress: userLogin.name }, function(err, userRecord) {

        if(err) return next(err);
    
        if (userRecord) {
            bcrypt.compare(userLogin.pass, userRecord.password, function(err, isMatch) {
                if (err || !isMatch) {
                    // Password invalid
                    return next(401);
                }
                // Passwords match and user is authenticated
                req.user = userRecord;
                return next();     
            });
        } else {
            // Email invalid
            return next(401);
        }
    }); 
}

module.exports.authenticate = authenticate;