var passport = require('passport');
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
                      return done(null, user);
                      
                  }else{
                      //res.json({ msg: 'wrong password'});
                      return done(null, false, { msg: 'wrong password'});
                  }
                  
              }else{
               //console.log('user not found');
              // res.json({msg: 'user not found'});
                return done(null, false, {msg: 'user not found'});
            }
           }
        });
    
}));


