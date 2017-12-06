// // Initialize a project 

// var readline = require('readline');
// var google = require('googleapis');
// var OAuth2Client = google.auth.OAuth2;
// var CLIENT_ID = '609469981923-v9lqmmh20t5ghi829bth3flnqgna8au8.apps.googleusercontent.com';
// var CLIENT_SECRET = '0KEh7DqxXeilFRfiLaRAq6YS';
// var REDIRECT_URL = 'http://localhost:3002/oauth2Callback';
// var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET,REDIRECT_URL);
// var plus = google.plus('v1');

// Date.prototype.addHours = function(h) {    
//    this.setTime(this.getTime() + (h*60*60*1000)); 
//    return this;   
// }

// function setCredentials(token){
// 	oauth2Client.setCredentials({
// 	  access_token: 'ACCESS TOKEN HERE',
// 	  refresh_token: 'REFRESH TOKEN HERE',
// 	  expiry_date: new Date().addHours(2) 
// 	});
// }

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });


// function getAccessToken (oauth2Client, callback) {
//   // generate consent page url
//   var url = oauth2Client.generateAuthUrl({
//     access_type: 'offline', // will return a refresh token
//     scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
//   });

//   rl.question('Enter the code here:', function (code) {
//     // request access token
//   	console.log('Visit the url: '+ code);
//     oauth2Client.getToken(code, function (err, tokens) {
//       if (err) {
//         return callback(err);
//       }
//       // set tokens to the client
//       // TODO: tokens should be set by OAuth2 client.
//       setCredentials(tokens);
//       callback();
//     });
//   });
// }

// getAccessToken(oauth2Client, function () {
//   // retrieve user profile
//   plus.people.get({ userId: 'me', auth: oauth2Client }, function (err, profile) {
//     if (err) {
//       return console.log('An error occured', err);
//     }
//     // console.log("getAccessToken"+ profile.displayName, ':', profile.tagline);
//   });
// });



// Initialize a project 
 var express = require('express'),
    routes = express();

var db = require("../model/db");
var schema = require("../model/schema");

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
  function(request, accessToken, refreshToken, profile, done) {
  	console.log("ProfileEmail is:"+ profile.emails)
  	console.log("ProfileId is:"+ profile.picture)
  	console.log("ProfileDN is:"+ profile.displayName)
    schema.User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

schema.User.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
     console.log(profile)
    this.findOne({_id : profile.id},function(err,result){ 
        if(!result){
            // userObj.username = profile.displayName;
            // //....
            // userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
};

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