var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Schema
var RegSchema = new Schema({
    Name: String,
    Email: String,
    Pass: String,
    userId: Number,
    roles: ['user', 'admin'],
    createdAt: Date,
    updatedAt: Date
}, { collection: 'signupColl' });


// set created and updated date before save
RegSchema.pre('save', function(next) {
	console.log("Saved")
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

var User = mongoose.model('User', RegSchema);

// create model using schema

module.exports = {
    User: User
};