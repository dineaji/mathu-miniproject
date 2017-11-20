console.log("started")

var express = require("express");
var cors = require("cors");
var hbs = require("hbs");
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var http = require("request");
// var session = require('express-session');

var db = require("./model/db");
var schema = require("./model/schema");
var app = express();
var corsOptions = {
  origin: 'https://play.hotwheels.com'
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

var feedbackUrl = "http://localhost:3002/feedbackDatas.json";
// app.use(cors(corsOptions))
app.use(cors())
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({ secret: "sss" }));
// app.use(session({
//     secret: "fd34s@!@dfa453f3DF#$D&W",
//     resave: false,
//     saveUninitialized: true,
//     users_schema : '',
//     cookie: { secure: !true }
// }));
// app.options('*', corsHandler); // include before other routes

var PORT = process.env.PORT || 3002;

// partial view
hbs.registerPartials(__dirname+'/views/partials');

// const publicPath = path.join(__dirname, '../views');

app.set('view engine', 'hbs');

// public folders path
app.use(express.static(__dirname +'/static'));

// ?
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

app.get('/',function(req,res){
	console.log("redirecting...")
	res.redirect("/home");
})
app.get('/home',function(req,res){
	console.log(req.session.uname);
	res.render('landing',{
		'pageTitle' : 'Home Page',
		'session' :  req.session && req.session.uname
	})
})

app.get('/signup',function(req,res){
	console.log("SignUp Page");
	res.render('signup',{
		'pageTitle' : 'Signup',
		'session' :  req.session && req.session.uname
	})
})

app.get('/login',function(req,res){
	console.log("login Page");
	res.render('login',{
		'pageTitle' : 'Login',
		'session' :  req.session && req.session.uname
	})
})

app.get('/feedback',function(req,res){
	console.log("feedback Page");
	http({
	    url: feedbackUrl,
	    json: true
	}, function (error, response, body) {
		console.log(error)
		// console.log(response)
	    if (!error && response.statusCode === 200) {
	        // console.log(body) // Print the json response
			res.render('feedback',{
				'pageTitle' : 'Feedback',
				'session' :  req.session && req.session.uname,
				'feedbackFields' : body
			})
	    }
	    else{
	    	res.send("please try after some time");
	    }
	})
})


// After SignUp
app.post('/signUp',function(req,res,next){
	console.log(req.body);
	var userData = {
		Name: req.body.name,
	    Email: req.body.email,
	    Pass: req.body.password,
	    UserId: req.body.number,
	    roles : ['user']
	}
	// console.log(userData);
	schema.User.findOne({'Email':userData.Email,'UserId': userData.UserId},function(err, existingUser) {
		if(existingUser){
			console.log(req.session)
				// console.log(req.session.users_schema)
			if(existingUser.roles.indexOf('admin')!=-1){
				return res.send("you are a admin");
			}
			existingUser.status = "Existing User"
			return res.send("Existing User");
		} else{
			userData.status = "created User"
			schema.User.create(userData,function(err,newUser){
				console.log("new user"+req)
				if(err) return next(err);
				req.session.uname  = userData.Name;
				console.log(req.session.uname)
				return res.send(userData);
			})
		}
	})
})

app.post('/login',function(req,res,next){
	var userData = {
		UserId : req.body.number,
		pass : req.body.password
	}
	schema.User.findOne({'UserId':userData.UserId,'Pass':userData.pass}).exec(function(err,existingUser){
		if(existingUser){
			req.session.uname = userData.Email;
			if(existingUser.roles.indexOf('admin')!=-1){
				return res.send("you are a admin user");
			}
			return res.send(existingUser)
		}
		else{
			return res.send("not an existing user");
		}
	})
})

app.get('/logout', function (req, res) {
	console.log("Log Out Suucessfully")
   req.session.uname = null;
   res.redirect("/home");
});

function isLoggedIn (req, res, next) {
	// console.log(req.session.users_schema)
  if (!(req.session && req.session.uname)) {
    return res.send('Not logged in!');
  }
  next();
}

app.get("/isLoggedIn", function (req, res) {
	// console.log(req.session)
   // console.log("testing api")
})

app.listen(PORT, onListen);

function onListen() {
   // logger.writeToLog(`Game service started on ${PORT}`);
    console.log('Listening on', PORT);
}

module.exports = app;