var avril = require('avril')
, appConfig = avril.getConfig('app')
, nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", appConfig.smtpOptions);

var exports = module.exports = {
    send: function (subject, body, to) {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: appConfig.smtpOptions.auth.user, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: body, // plaintext body
            html: body// html body
        };

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    }
};