
var passport = require('passport');
//var passportStrategy = require('../config/passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('../datasets/users');

module.exports.handlelocal = function(req, res, next){
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    passport.authenticate('local', function(err, user, info){
        if(err){
            res.status(500);
            res.error(err);
            console.log(err);
        }
        if(!user){
            res.status(500);
            res.json(info);
            //console.log(info);
        }
        if(user){
            res.status(200);
            res.json(user);
            //console.log(user);
        }
    })(req, res, next); 
}