var express = require('express');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartyMiddleware = multipart();
var jwt = require('jsonwebtoken');
var jwtexpresss = require('express-jwt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var secureRoutes = express.Router();

var authlocal = require('./server/config/passport');
var localauth = require('./server/controllers/passport-local-Controller');

var registeruser = require('./server/controllers/register-Controller');


var loginuser = require('./server/controllers/login-Controller');


var dashboard = require('./server/controllers/dashboard-Controller');

var cv = require('./server/controllers/cv-Controller');
var job = require('./server/controllers/job-Controller');
var Users = require('./server/datasets/users');
var app = express();
app.use(favicon(path.join(__dirname , 'uploads' , 'favicon.ico')));
//mongoose.connect('mongodb://omang:214919117.omang@jobcard-shard-00-00-ib73t.mongodb.net:27017,jobcard-shard-00-01-ib73t.mongodb.net:27017,jobcard-shard-00-02-ib73t.mongodb.net:27017/weblab?ssl=true&replicaSet=jobcard-shard-0&authSource=admin');
mongoose.connect('mongodb://jobUser:214919117omang@ds137291.mlab.com:37291/jobcard');

app.use(bodyParser.json());
app.use(multipartyMiddleware);
app.use('/jobcard', express.static(__dirname + "/jobcard"));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/bower_components', express.static(__dirname + "/bower_components"));
app.use('/uploads', express.static(__dirname + "/uploads"));
app.use(passport.initialize());
require('./server/config/passport')(passport);
//passport.use(passport.session());
app.use('/secure-api', secureRoutes);
secureRoutes.use(function(req, res, next){
    console.log(req.body);
    var token = req.body.token || req.headers['token'];
    if(token){
        jwt.verify(token,"My_stuff",function(err, decode){
            if(err){
                res.status(500).send("invalid token");
            }else{
                next();
            }
        });
    }else{
        res.send('no fucking token');
    }
});



app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.post('/api/login/login',localauth.handlelocal);
         
         

app.post('/api/register/register', registeruser.registerUser);
//app.post('/api/login/login', loginuser.loginUser);
app.post('/api/add/usercard', loginuser.addCard);
app.post('/api/jobox/checkbox', loginuser.joBox);
app.post('/api/dash/updates', loginuser.getdash);
app.post('/api/getuser/data', loginuser.getdash);

secureRoutes.post('/edit/profile', multipartyMiddleware, dashboard.updateProfile);
app.post('/api/get/profile', dashboard.getProfile);

app.post('/api/create/cv', cv.cvCreate);
app.post('/api/check/cv', cv.checkCv);

app.post('/api/get/cv', cv.getCv);
app.post('/api/getcv/getcv', cv.getCv);


app.post('/api/create/job', job.jobCreate);
app.post('/api/check/job', job.checkJob);
app.post('/api/addlike/add', job.addLike);
app.post('/api/likebox/check', job.likeBox);
app.post('/api/getjob/job', job.checkJob);
app.post('/api/getcards/cards', job.likeBox);
app.post('/api/postcv/postcv', job.postCv);
app.post('/api/checkpost/checkpost', job.checkPost);
app.post('/api/getjobs/getjobs', job.getJob);
app.post('/api/latereview/review', job.cvReview);
app.post('/api/check/review', job.reviewCheck);

app.get('/api/get/card', job.getCard);

var port = process.env.PORT || 8080;

app.listen(port, function(){
    console.log("listerning for localhost at port 8080" + port);
});