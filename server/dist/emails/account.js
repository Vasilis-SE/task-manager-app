"use strict";

var sendgridMail = require('@sendgrid/mail');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

var sendWelcomeEmail = function sendWelcomeEmail(email, name) {
  sendgridMail.send({
    to: email,
    from: 'vasilis.tris@gmail.com',
    subject: 'Thanks for joining in!',
    text: "Welcome to the app ".concat(name, ". Let me know how you get along with the app...")
  });
};

var sendCancelationEmail = function sendCancelationEmail(email, name) {
  sendgridMail.send({
    to: email,
    from: 'vasilis.tris@gmail.com',
    subject: 'User Account Cancelation',
    text: "You feel so sorry to see you go ".concat(name, ". It would mean so much for us if you could spare two minutes from your time to send us a feedback of your experiences with the app")
  });
};

module.exports = {
  sendWelcomeEmail: sendWelcomeEmail,
  sendCancelationEmail: sendCancelationEmail
};