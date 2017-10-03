'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  Student = mongoose.model('Student');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var student = new Student(req.body);
  var message = null;

  // Add missing user fields
  student.provider = 'local';
  student.displayName = student.firstName + ' ' + student.lastName;

  // Then save the user
  student.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })student} else {
      //studentove sensitive dstudentbefore login
      usestudentssword = undefined;
      student.salt = undefined;

      req.login(student, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(student);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, student, info) {
    if (err || !student) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      student.password = undefined;
      student.salt = undefined;

      req.login(student, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(student);
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
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, student, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!student) {
        return res.redirect('/authentication/signin');
      }
      req.login(student, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth student profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
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

    Student.findOne(searchQuery, function (err, student) {
      if (err) {
        return done(err);
      } else {
        if (!student) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          Student.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            student = new Student({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
          student.save(function (err) {
              return done(err, student);
            });
          });
        } else {
          return done(err, student);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var student = req.student;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (student.provider !== providerUserProfile.provider && (!student.additionalProvidersData || !student.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!student.additionalProvidersData) {
        student.additionalProvidersData = {};
      }

      student.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      student.markModified('additionalProvidersData');

      // And save the user
      student.save(function (err) {
        return done(err, student, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), student);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var student = req.student;
  var provider = req.query.provider;

  if (!student) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (student.additionalProvidersData[provider]) {
    delete student.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    student.markModified('additionalProvidersData');
  }

  student.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(student, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(student);
        }
      });
    }
  });
};
