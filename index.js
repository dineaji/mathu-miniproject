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
var _ = require('lodash');
var mailer = require('nodemailer');
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



// create reusable transporter object using the default SMTP transport
let transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "dineajinodemailer@gmail.com",
        pass: "27smss106"
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Complaint Forum - TU 👻" <test@thiruvalluvarUniversity.com>', // sender address
    to: 'dineaji@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
};

// send mail with defined transport object
function sendEmail(){
	console.log(mailOptions);
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message sent: %s', info.messageId);
	    // Preview only available when sending through an Ethereal account
	    console.log('Preview URL: %s', mailer.getTestMessageUrl(info));
	});
}

function renderParams(req,pageTitle,datas){
	return {
		'pageTitle' : getPageTitle(pageTitle),
		'session' :  req.session && req.session.uname,
		'roleName' : req.session && req.session.role,
		'collections' : datas!=undefined ? datas : 0,
		'collegeName' :  req.session && req.session.cname,
	}
}
function getPageTitle(fileName){
	var pageTitle = "";
	switch(fileName){
		case 'home':
			pageTitle = "Home Page";
			break;
		case "signup":
			pageTitle = "SignUp Page";
			break;
		case "login":
			pageTitle = "Login Page";
			break;
		case "feedback":
			pageTitle = "Feedback";
			break;
		case "createissue":
			pageTitle = "createissue";
			break;
		case "myissues":
			pageTitle = "myissues";
			break;
		case "detail":
			pageTitle = "issueDetail";
			break;
	}
	return pageTitle;
}

app.get('/',function(req,res){
	console.log("redirecting...")
	res.redirect("/home");
})

app.get('/home',function(req,res){
	var data = {};
	if(req.session && req.session.role){
		if(req.session.role=="admin"){
			schema.Complaint.find({}, function(err, datas) {
				data.length = _.size(datas)
				data.obj = _(datas).groupBy('Status').map((items, name) => ({ name, count: items.length })).value();
				res.render('landing',renderParams(req,'home',data));
			})
		} else{
			schema.Complaint.find({'consumerId':req.session.consumerId}).exec(function(err,datas){
				data.length = _.size(datas)
				data.obj = _(datas).groupBy('Status').map((items, name) => ({ name, count: items.length })).value();
-				console.log(data)
				res.render('landing',renderParams(req,'home',data));
			})
		}
	} else{
		console.log(renderParams(req,'home'))
		res.render('landing',renderParams(req,'home'));
	}
})

app.get('/signup',function(req,res){
	res.render('signup',renderParams(req,'signup'));
})

app.get('/login',function(req,res){
	res.render('login',renderParams(req,'login'));
})

app.get('/feedback',function(req,res){
	if(!req.session.uname){
		res.redirect("/login");
		return;
	}
	res.render('feedback',renderParams(req,'feedback'));
})

app.get('/feedback/createissue',function(req,res){
	console.log("feedback createissue page");
	if(!req.session.uname){
		res.redirect("/login");
		return;
	}
	res.render('feedback',renderParams(req,'createissue'));
})

app.get('/feedback/myissues',function(req,res){
	console.log("feedback myissues page");
	if(!req.session.uname){
		res.redirect("/login");
		return;
	}
	var userData = {
	    consumerId : req.session.consumerId
	}
	if(req.session.role=="admin"){
		schema.Complaint.find({}, function(err, datas) {
		    if (!err){ 
		        res.render('feedback',renderParams(req,'myissues',datas));
		    } else {throw err;}
		});
	}
	else{
		schema.Complaint.find({'consumerId':userData.consumerId}).exec(function(err,datas){
			res.render('feedback',renderParams(req,'myissues',datas));
		})
		
	}
})

// issue detail
app.get('/feedback/myissues/status/:id',function(req,res){
	var userData = {
	    consumerId : req.session.consumerId
	}
	if(req.session.role=="admin"){
		schema.Complaint.find({'Status':req.params.id}).exec(function(err,datas){
			res.render('feedback',renderParams(req,'myissues',datas));
			console.log(datas);
		})
	} else{
		schema.Complaint.find({'consumerId':userData.consumerId,'Status':req.params.id}).exec(function(err,datas){
			res.render('feedback',renderParams(req,'myissues',datas));
			console.log(datas);
		})
		
	}
})

// issue detail
app.get('/feedback/myissues/detail/:id',function(req,res){
	console.log("feedback detail page");
	schema.Complaint.find({'_id':req.params.id}).exec(function(err,datas){
		res.render('feedback-detail',renderParams(req,'detail',datas));
	})
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

				mailOptions.to = newUser.Email;
				mailOptions.subject = "Welcome to Thiruvalluvar University";
				mailOptions.text = mailOptions.html = "Thanks for Signing Up. You'll get all the updates when you create  / update any issue";

				sendEmail();
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

app.post('/updateTicket',function(req,res,next){
	console.log(req.body);
	var data = {
		_id : req.body.id,
	}
	schema.Complaint.findByIdAndUpdate(
		req.body.id,
	    {$push: {"EnteredQuery": {'rolename' :  req.body.role ,'thoughts' : req.body.enteredQuery}},$set : {Status : req.body.status}},
	    {safe: true, upsert: true},
	    function(err, model) {
	        console.log(err);
	    }
	   )
	res.send("Successfully Posted");
	
});

app.listen(PORT, onListen);

function onListen() {
   // logger.writeToLog(`Game service started on ${PORT}`);
    console.log('Listening on', PORT);
}

module.exports = app;