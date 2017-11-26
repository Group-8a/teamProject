'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto');
// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup',
  './authentication/invite'
];
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var smtpTransport = nodemailer.createTransport(config.mailer.options);
/**
 * Signup
 */
exports.inviteSignin = function(req, res){
  var token = req.body.inviteToken;
  User.findOne({ inviteToken: req.body.inviteToken }, 'ufid', function(err, user){
    if (!user){
      res.status(200).send('no invite token');
    }
    else {
      if (user.ufid === req.body.ufid){
        res.status(200).send(['True', req.body.inviteToken]);
      }
      else {
        res.status(200).send('Ufid does not match');
      }
    }
  });
};

exports.invite = function(req, res){
  var user = new User(req.body.newUser);
  var token = Math.random().toString(36).substr(2, 5);
  //user.ufid = req.body.ufid;
  //user.primaryEmail.email = req.body.pemail;
  user.primaryEmail.email = req.body.primaryEmail.email;
  user.provider = 'local';
  if(req.body.roles.admin === true){
    user.roles = ['admin'];
  }
  user.username = token;
  user.inviteToken = token;
  user.firstName = "Invited User";
  user.last.lastName = token;
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(user);
  });
};

exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  console.log(req);
  console.log(req.body.roles);
  delete req.body.roles;

  // Init user and add missing fields
  console.log(req.body);
  var user = new User(req.body.credentials);


  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.last.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

exports.verifyForm = function (req, res) {
  var token = req.body.credentials.inviteToken;
  User.findOne({ inviteToken: req.body.credentials.inviteToken }, function(err, user) {
    if (err) {
      res.status(400).send('An error occured');
    } else if (user === null) {
      res.status(400).send('Not a valid invite token');
    } else if (user !== null && user.inviteTokenExpired === true) {
      res.status(400).send('Invite token has been used already');
    } else {
      user.firstName = req.body.credentials.firstName;
      user.last.lastName = req.body.credentials.last.lastName;
      user.last.lastNameDontShow = req.body.credentials.last.lastNameDontShow;
      user.primaryEmail.email = req.body.credentials.primaryEmail.email;
      user.primaryEmail.emailDontShow = req.body.credentials.primaryEmail.emailDontShow;
      user.username = req.body.credentials.username;
      user.secondaryEmail.email = req.body.credentials.secondaryEmail.email;
      user.secondaryEmail.secondaryEmailDontShow = req.body.credentials.secondaryEmail.secondaryEmailDontShow;
      user.major.major = req.body.credentials.major.major;
      user.major.majorDontShow = req.body.credentials.major.majorDontShow;
      user.password = req.body.credentials.password;
      user.gradDate.date = req.body.credentials.gradDate.date;
      user.gradDate.dateDontShow = req.body.credentials.gradDate.dateDontShow;
      user.linkedin.url = req.body.credentials.linkedin.url;
      //user.linkedin.linkedinDontShow = req.body.linkedin.linkedinDontShow;
      user.joinLab = req.body.credentials.joinLab;
      user.displayName = user.firstName + ' ' + user.last.lastName;
      user.inviteTokenExpired = true;

      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          user.password = undefined;
          user.salt = undefined;

          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else {
              res.json(user);
            }
          });
        }

      });
    }
  });
};
/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    if (req.query && req.query.redirect_to)
      req.session.redirect_to = req.query.redirect_to;

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info and user objects
  var info = {};
  var user;

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1) {
    info.redirect_to = req.session.redirect_to;
  }

  // Define a search query fields
  var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
  var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

  // Define main provider search query
  var mainProviderSearchQuery = {};
  mainProviderSearchQuery.provider = providerUserProfile.provider;
  mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define additional provider search query
  var additionalProviderSearchQuery = {};
  additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define a search query to find existing user with current provider profile
  var searchQuery = {
    $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
  };

  // Find existing user with this provider account
  User.findOne(searchQuery, function (err, existingUser) {
    if (err) {
      return done(err);
    }

    if (!req.user) {
      if (!existingUser) {
        var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

        User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
          user = new User({
            firstName: providerUserProfile.firstName,
            lastName: providerUserProfile.lastName,
            username: availableUsername,
            displayName: providerUserProfile.displayName,
            profileImageURL: providerUserProfile.profileImageURL,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData
          });

          // Email intentionally added later to allow defaults (sparse settings) to be applid.
          // Handles case where no email is supplied.
          // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
          user.email = providerUserProfile.email;

          // And save the user
          user.save(function (err) {
            return done(err, user, info);
          });
        });
      } else {
        return done(err, existingUser, info);
      }
    } else {
      // User is already logged in, join the provider data to the existing user
      user = req.user;

      // Check if an existing user was found for this provider account
      if (existingUser) {
        if (user.id !== existingUser.id) {
          return done(new Error('Account is already connected to another user'), user, info);
        }

        return done(new Error('User is already connected using this provider'), user, info);
      }

      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, info);
      });
    }
  });
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};

exports.sendInvite = function (req, res, next) {
  //var emailhtml = undefined;
  //console.log('here');
  var inviteToken = 1;
  var email = "";
  User.findOne({ ufid: req.body.ufid }, 'inviteToken primaryEmail.email', function (err, user) {
    if (!err && user) {
      inviteToken = user.inviteToken;
      email = user.primaryEmail.email;
    } else {
      return res.status(400).send({
        message: 'email is invalid or has expired.'
      });
    }
  }).then(function (user, inviteToken, email) {
    var textemail = "Hello! \n \n You have been invited to join MIL! \n Please use the following invite code and url to create a new account: \n" + user.inviteToken +"\n http://localhost:3000/authentication/inviteSignin \n \n \n  Have great day, \n The MIL Team";
    var mailOptions = {
      to: user.primaryEmail.email,
      from: config.mailer.from,
      subject: 'You are invited to MIL!',
      text: textemail
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
  });
};
