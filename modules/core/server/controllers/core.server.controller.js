'use strict';
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  passport = require('passport'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var smtpTransport = nodemailer.createTransport(config.mailer.options);
/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.sendContactForm = function (req, res) {
  //var emailhtml = undefined;
  console.log(req.body);
  var message = '---------------------------\n \n' + req.body.message + '\n \n From, \n' + req.body.studentName + '\n ---------------------------- \n \n Please respond to this person with the following email: \n' + req.body.studentEmail;
  var mailOptions={
    to: config.mailer.from,
    from: config.mailer.from,
    subject: '[MIL]' + req.body.subject,
    text: message
  };
  smtpTransport.sendMail(mailOptions, function (err) {
    if (!err) {
      res.send({
        message: 'An email has been sent to the provided email with further instructions.'
      });
    } else {
      console.log(err);
      return res.status(400).send({
        message: 'Failure sending email'
      });
    }
  });
};
