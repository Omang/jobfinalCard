
var passport = require('passport');
//var passportStrategy = require('../config/passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('../datasets/users');
passport.use(new LocalStrategy(function(username, password, done){
    
     Users.findOne({username: username}).exec(function(err, user){
           if(err){
               return done(err);
           }else{
              if(user !== null){
                 var salt = user.salt;
                 var hash = user.hash;
                 var verifypass = crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
                  if(verifypass === hash){
                    var user = jwt.sign({
                      userid: user._id,
                      username: user.username,
                      email: user.email,
                      }, "My_stuff");
                      //res.json(token);
                      return done(user);
                      
                  }else{
                      //res.json({ msg: 'wrong password'});
                      return done({ msg: 'wrong password'});
                  }
                  
              }else{
               //console.log('user not found');
              // res.json({msg: 'user not found'});
                return done({msg: 'user not found'});
            }
           }
        });
    
}));
module.exports.handlelocal = function(req, res){
    passport.authenticate('local', function(err, user, info){
        if(err){
            res.status(500);
            res.error(err);
            console.log(err);
        }
        if(!user){
            res.status(500);
            res.json(info);
            console.log(info);
        }
        if(user){
            res.status(200);
            res.json(user);
            console.log(user);
        }
    });
}