console.log("started")

var express = require("express");
var cors = require("cors");
var hbs = require("hbs");
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// var session = require('express-session');

var db = require("./model/db");
var schema = require("./model/schema");
var app = express();

var corsOptions = {
  origin: 'https://play.hotwheels.com'
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
// app.use(cors(corsOptions))
app.use(cors())
app.use(bodyParser.json());

app.use(cookieParser());
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
	console.log("Landing Page");
	res.render('landing',{
		'pageTitle' : 'Home Page'
	})
})

app.get('/signup',function(req,res){
	console.log("SignUp Page");
	res.render('signup',{
		'pageTitle' : 'Sign Up Page'
	})
})

app.get('/login',function(req,res){
	console.log("login Page");
	res.render('login',{
		'pageTitle' : 'Log In Page'
	})
})
// After SignUp
app.post('/signUp',function(req,res,next){
	console.log(req.body);
	var userData = {
		Name: req.body.name,
	    Email: req.body.email,
	    Pass: req.body.password,
	    userId: req.body.number,
	    roles : ['user']
	}
	// console.log(userData);
	schema.User.findOne({'Email':userData.Email},function(err, existingUser) {
		if(existingUser){
			console.log(req.session)
				// console.log(req.session.users_schema)
			if(existingUser.roles.indexOf('admin')!=-1){
				return res.send("you are a admin");
			}
			// existingUser.status = "Existing User"
			return res.send("Existing User");
		} else{
			userData.status = "created User"
			schema.User.create(userData,function(err,newUser){
				console.log("new user"+req)
				if(err) return next(err);
				req.session.users_schema  = userData.Email;
				console.log(req.session)
				return res.send(userData);
			})
		}
	})
})

app.post('/login',function(req,res,next){
	var userData = {
		userId : req.body.number,
		pass : req.body.password
	}
	schema.User.findOne({'Email':userData.Email,'Pass':userData.pass}).exec(function(err,existingUser){
		if(existingUser){
			req.session.users_schema = userData.Email;
			if(existingUser.roles.indexOf('admin')!=-1){
				return res.send("you are a admin user");
			}
			return res.send("welcome "+existingUser.Name )
		}
		else{
			console.log("u are a not existing user")
			return res.send(err);
		}
	})
})

app.get('/logout', function (req, res) {
   req.session.users_schema = null;
});

function isLoggedIn (req, res, next) {
	// console.log(req.session.users_schema)
  if (!(req.session && req.session.users_schema)) {
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