var mongoose = require("mongoose");

var mongooseRole = require("mongoose-role");

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var url;

console.log(env)
if(env == "development"){
	// url = "mongodb://localhost:27017/signupregistration";
	url="mongodb://uname:pwd@ds157325.mlab.com:57325/signupregistration";
} 
else{
	url="mongodb://uname:pwd@ds157325.mlab.com:57325/signupregistration";
}
mongoose.connect(url , { useMongoClient: true });

var db = mongoose.connection;
db.on('error',function(err){
	console.log("DB Connection Error")
})
db.on('open',function(){
	console.log("DB Connected");
})