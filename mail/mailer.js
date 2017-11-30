var express = require("express");
var mailer = require('nodemailer');


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
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', mailer.getTestMessageUrl(info));
});

var Complaint = mongoose.model('Complaint', CompSchema);

// create model using schema

module.exports = {
    User: User,
    Complaint :Complaint
};