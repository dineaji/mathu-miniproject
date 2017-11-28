console.log("started")

var express = require("express");
var cors = require("cors");
var hbs = require("hbs");
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var http = require("request");
var dateFormat = require('dateformat');
// var session = require('express-session');

var db = require("./model/db");
var schema = require("./model/schema");
var app = express();
var corsOptions = {
  origin: 'https://play.hotwheels.com'
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

var feedbackUrl = "http://localhost:3002/feedbackDatas.json";
var categoryUrl = "http://localhost:3002/complaintCategory.json";
// app.use(cors(corsOptions))
app.use(cors())
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({ secret: "sss" }));

var PORT = process.env.PORT || 3002;

// partial view
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
hbs.registerHelper("inc", function(value, options){return parseInt(value) + 1;});
hbs.registerPartials(__dirname+'/views/partials');

// const publicPath = path.join(__dirname, '../views');

app.set('view engine', 'hbs');

// public folders path
app.use(express.static(__dirname +'/static'));

// ?
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

app.get('/',function(req,res){
	console.log("redirecting...")
	res.redirect("/home");
})
app.get('/home',function(req,res){
		console.log("Home"+req.session.roleName);
	if(req.session.role=="admin"){
		res.redirect("/feedback/myissues")
	}
	res.render('landing',{
		'pageTitle' : 'Home Page',
		'session' :  req.session && req.session.uname,
		'roleName' : req.session && req.session.role
	})
})

app.get('/signup',function(req,res){
	console.log("SignUp Page");
	res.render('signup',{
		'pageTitle' : 'Signup',
		'session' :  req.session && req.session.uname,
		'roleName' : req.session && req.session.role
	})
})

app.get('/login',function(req,res){
	console.log("login Page");
	res.render('login',{
		'pageTitle' : 'Login',
		'session' :  req.session && req.session.uname,
		'roleName' : req.session && req.session.role
	})
})

app.get('/feedback',function(req,res){
	if(!req.session.uname){
		res.redirect("/login");
		return;
	}
	console.log("feedback Page");
	res.render('feedback',{
		'pageTitle' : 'Feedback',
		'session' :  req.session && req.session.uname,
		'collegeName' :  req.session && req.session.cname,
		'roleName' : req.session && req.session.role
	})
})

app.get('/feedback/createissue',function(req,res){
	if(!req.session.uname){
		res.redirect("/login");
		return;
	}
	console.log("createissue Page");
	res.render('feedback',{
		'pageTitle' : 'createissue',
		'session' :  req.session && req.session.uname,
		'collegeName' :  req.session && req.session.cname,
		'roleName' : req.session && req.session.role,
	})
})

app.get('/feedback/myissues',function(req,res){
	if(!req.session.uname){
		res.redirect("/login");
		return;
	}
	var userData = {
	    consumerId : req.session.consumerId
	}
	var resDatas;
	if(req.session.role=="admin"){
		schema.Complaint.find({}, function(err, datas) {
		    if (!err){ 
		        console.log("Admin"+datas);
		        resDatas = datas;
		        res.render('feedback',{
					'pageTitle' : 'myissues',
					'session' :  req.session && req.session.uname,
					'roleName' : req.session && req.session.role,
					'collegeName' :  req.session && req.session.cname,
					'collections' : resDatas
				})
		        // response.send(datas)
		    } else {throw err;}
		});
	}
	else{
		schema.Complaint.find({'consumerId':userData.consumerId}).exec(function(err,datas){
			// console.log("1st trigger:"+datas);
			resDatas = datas;
			// response.send(datas)
			res.render('feedback',{
				'pageTitle' : 'myissues',
				'session' :  req.session && req.session.uname,
				'collegeName' :  req.session && req.session.cname,
				'roleName' : req.session && req.session.role,
				'collections' : resDatas
			})
		})
		
	}
	// console.log("2nd trigger:"+resDatas);
	
})

// collection.update({_id:"123"}, {author:"Jessica", title:"Mongo facts"});

// After SignUp
app.post('/signUp',function(req,res,next){
	// console.log(req.body);
	var userData = {
		Name: req.body.name,
	    Email: req.body.email,
	    Pass: req.body.password,
	    UserId: req.body.number,
	    Institute : req.body.collegeName,
	    createdAt : dateFormat(new Date(),"shortDate"),
	    roles : ['user']
	}
	// console.log(userData);
	schema.User.findOne({'Email':userData.Email,'UserId': userData.UserId},function(err, existingUser) {
		if(existingUser){
			// console.log(req.session)
				// console.log(req.session.users_schema)
			if(existingUser.roles.indexOf('admin')!=-1){
				return res.send("you are a admin");
			}
			existingUser.status = "Existing User"
			return res.send("Existing User");
		} else{
			userData.status = "created User"
			schema.User.create(userData,function(err,newUser){
				// console.log("new user"+req)
				if(err) return next(err);
				req.session.uname  = userData.Name;
				req.session.cname = userData.Institute;
				req.session.consumerId = newUser._id;
				req.session.role = newUser.roles[0];
				// console.log(newUser)
				return res.send(newUser);
				// console.log(newUser)
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
			req.session.uname = existingUser.Name;
			req.session.cname = existingUser.Institute;
			req.session.consumerId = existingUser._id;
			req.session.role = existingUser.roles[0];
			req.session.isAdmin = false;
			if(existingUser.roles.indexOf('admin')!=-1){
				req.session.isAdmin = true;
				return res.send("you are a admin user");
			}
			// console.log(existingUser)
			return res.send(existingUser)
		}
		else{
			return res.send("not an existing user");
		}
	})
})

app.get('/logout', function (req, res) {
	// console.log("Log Out Suucessfully")
   	req.session.uname = null;
   	req.session.cname = null;
	req.session.consumerId = null;
	req.session.role = null;
	

   res.redirect("/home");
});


app.post('/submitNewTicket',function(req,res,next){
	// console.log(req.query.id);
	var userData = {
		Category: req.body.category,
	    SubCategory: req.body.subCategory,
	    Institute : req.session.cname,
	    Status: req.body.status,
	    consumerId : req.session.consumerId || req.body.consumerId,
	    EnteredQuery: [{
	        'rolename' :  req.session && req.session.role || 'user',
	        'thoughts' : req.body.enteredQuery
	    }]
	}
	// console.log(userData)
	schema.Complaint.create(userData,function(err){
		if(err) return next(err);
		// console.log(req.session.uname)
		return res.send("Successfully Posted");
	})
})

app.get('/getSubmittedTicket',function(req,response,next){
		// console.log("getSubmittedTicket fn triggered")
		// console.log(req.query.id);
		var userData = {
		    consumerId : req.session.consumerId || req.query.id
		}
		var resDatas;
		if(req.session.isAdmin){
			schema.Complaint.find({}, function(err, datas) {
			    if (!err){ 
			        // console.log(datas);
			        resDatas = datas;
			        // response.send(datas)
			    } else {throw err;}
			});
		}
		else{
			schema.Complaint.find({'consumerId':userData.consumerId}).exec(function(err,datas){
				// console.log(datas);
				resDatas = datas;
				// response.send(datas)
			})
			
		}
		
	})


app.listen(PORT, onListen);

function onListen() {
   // logger.writeToLog(`Game service started on ${PORT}`);
    console.log('Listening on', PORT);
}

module.exports = app;