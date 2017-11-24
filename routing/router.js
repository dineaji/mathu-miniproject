console.log("router JS triggered")
var express = require("express");
var router = express.Router();
var hbs = require("hbs");

var app = express();

var PORT = process.env.PORT || 3002;

// hbs.registerPartials(__dirname+'/views/partials');

hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("ifvalue", function(conditional, options) {
    if (conditional == options.hash.equals) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerPartials(__dirname+'/views/partials');
const publicPath = path.join(__dirname, '../views');

app.set('view engine', 'hbs');

// public folders path
app.use(express.static(__dirname +'../static'));


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
	res.render('feedback',{
		'pageTitle' : 'Feedback',
		'session' :  req.session && req.session.uname,
		'collegeName' :  req.session && req.session.cname
	})
})

app.get('/feedback/createissue',function(req,res){
	console.log("createissue Page");
	res.render('feedback',{
		'pageTitle' : 'createissue',
		'session' :  req.session && req.session.uname,
		'collegeName' :  req.session && req.session.cname
	})
})

app.get('/feedback/myissues',function(req,res){
	console.log("feedback Page");
	res.render('feedback',{
		'pageTitle' : 'myissues',
		'session' :  req.session && req.session.uname,
		'collegeName' :  req.session && req.session.cname
	})
})

app.listen(PORT, onListen);

function onListen() {
   // logger.writeToLog(`Game service started on ${PORT}`);
    console.log('Listening on', PORT);
}

// module.exports = app;