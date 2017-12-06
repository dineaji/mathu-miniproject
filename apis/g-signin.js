
// Initialize a project 
 var express = require('express'),
    routes = express();

var db = require("../model/db");
var schema = require("../model/schema");

var session = require('express-session');

routes.use(session({
 secret: "sss" ,
 resave: true,
 saveUninitialized: true
}));

var dateFormat = require('dateformat');

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth2').Strategy;
 
var CLIENT_ID = '609469981923-v9lqmmh20t5ghi829bth3flnqgna8au8.apps.googleusercontent.com';
var CLIENT_SECRET = '0KEh7DqxXeilFRfiLaRAq6YS';
var REDIRECT_URL = 'http://localhost:3002/auth/google/callback';

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret:CLIENT_SECRET,
    callbackURL: REDIRECT_URL,
    passReqToCallback   : true
  },
  function(req, accessToken, refreshToken, profile, done) {
  	// console.log(profile.placesLived)
  	// console.log(profile.emails)
    console.log(profile.id,
                profile.displayName,
                profile.emails)



// schema.User.create(userData,function(err,newUser){


//   done(err,userData)
// })
    schema.User.findOrCreate({ googleId: profile.id,obj:profile }, function (err, user) {
      req.session.uname = profile.displayName;
      req.session.cname = '';
      req.session.consumerId = profile.id;
      req.session.role = 'user';
      req.session.isAdmin = false;
      return done(err, user);
    });
  }
));

schema.User.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
     console.log(profile.obj)
    this.findOne({_id : profile.obj.id},function(err,result){ 
        if(!result){
          userObj.Name =  profile.obj.displayName;
          userObj.Email =  profile.obj.emails==undefined ? '' : profile.obj.emails[0].value
          userObj.Pass =  '12345'
          userObj.UserId =  profile.obj.id
          userObj.Institute =  profile.obj.placesLived==undefined ? '' : profile.obj.placesLived[0].value 
          userObj.createdAt =  dateFormat(new Date(),"shortDate")
          userObj.roles =  ['user']
          userObj.username = profile.obj.displayName
          console.log("userObj " + userObj)
           userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


module.exports = passport;

 // provider         always set to `google`
 //   id
 //   name
 //   displayName
 //   birthday
 //   relationship
 //   isPerson
 //   isPlusUser
 //   placesLived
 //   language
 //   emails
 //   gender
 //   picture

