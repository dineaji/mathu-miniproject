var mongoose = require("mongoose");
var dateFormat = require('dateformat');

var Schema = mongoose.Schema;

// Schema
var RegSchema = new Schema({
    Name: String,
    Email: String,
    Pass: String,
    UserId: String,
    roles: ['user', 'admin'],
    Institute : String,
    createdAt: Date,
    updatedAt: Date
}, { collection: 'signupColl' });

var CompSchema = new Schema({
    Category: String,
    SubCategory: String,
    EnteredQuery: String,
    Status: String,
    consumerId : String,
    Institute : String,
    createdAt: Date,
    updatedAt: Date
}, { collection: 'complaintColl' });


// set created and updated date before save
RegSchema.pre('save', function(next) {
    var currentDate = dateFormat(new Date(),"shortDate");
	console.log("Saved"+currentDate)
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

CompSchema.pre('save', function(next) {
    console.log("Saved");
    
    var currentDate = dateFormat(new Date(),"shortDate");
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

var User = mongoose.model('User', RegSchema);

var Complaint = mongoose.model('Complaint', CompSchema);

// create model using schema

module.exports = {
    User: User,
    Complaint :Complaint
};