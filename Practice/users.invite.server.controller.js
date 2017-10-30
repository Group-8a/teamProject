'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);
exports.sendInvite = function (req, res, next) {
  var user = new User(req.body);
  console.log('body');
  console.log(req.body);
  user.ufid = req.body.ufid;
  user.primaryEmail.email = req.body.primaryEmail.email;
  user.last.lastName = 'b ';
  user.firstName = 'c ';
  user.username = ' b';
  user.provider = 'local';
  
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
  async.waterfall([
  // Generate random token
    function (done) {
      crypto.randomBytes(10, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
  // Lookup user by username
    function (token, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render(path.resolve('modules/users/server/templates/invite-email'), {
        name: user.displayName,
        url: httpTransport + req.headers.host + '/api/auth/signup',
        token: user.inviteToken
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
  // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.primaryEmail.email,
        from: config.mailer.from,
        subject: 'Inviation to signup to MIL',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }
        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};
