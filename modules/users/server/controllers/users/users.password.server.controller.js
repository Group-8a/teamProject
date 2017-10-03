'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.username) {
        Student.findOne({
          username: req.body.username.toLowerCase()
        }, '-salt -password', function (err, student) {
          if (!student) {
            return res.status(400).send({
              message: 'No account with that username has been found'
            });
          } else if (student.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + student.provider + ' account'
            });
          } else {
            student.resetPasswordToken = token;
            student.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            student.save(function (err) {
              done(err, token, student);
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Username field must not be blank'
        });
      }
    },
    function (token, student, done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
        name: student.displayName,
        appName: config.app.title,
        url: httpTransport + req.headers.host + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, student);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, student, done) {
      var mailOptions = {
        to: student.email,
        from: config.mailer.from,
        subject: 'Password Reset',
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

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  Student.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, student) {
    if (!student) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  async.waterfall([

    function (done) {
      Student.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, student) {
        if (!err && student) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            student.password = passwordDetails.newPassword;
            student.resetPasswordToken = undefined;
            student.resetPasswordExpires = undefined;

            student.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(student, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Remove sensitive data before return authenticated user
                    student.password = undefined;
                    student.salt = undefined;

                    res.json(student);

                    done(err, student);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function (student, done) {
      res.render('modules/users/server/templates/reset-password-confirm-email', {
        name: student.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, student);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, student, done) {
      var mailOptions = {
        to: student.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  if (req.student) {
    if (passwordDetails.newPassword) {
      Student.findById(req.student.id, function (err, student) {
        if (!err && student) {
          if (student.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              student.password = passwordDetails.newPassword;

              student.save(function (err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(student, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
