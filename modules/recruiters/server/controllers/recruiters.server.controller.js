'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Recruiter = mongoose.model('Recruiter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Recruiter
 */
exports.create = function(req, res) {
  var recruiter = new Recruiter(req.body);
  recruiter.user = req.user;

  recruiter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recruiter);
    }
  });
};

/**
 * Show the current Recruiter
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var recruiter = req.recruiter ? req.recruiter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  recruiter.isCurrentUserOwner = req.user && recruiter.user && recruiter.user._id.toString() === req.user._id.toString();

  res.jsonp(recruiter);
};

/**
 * Update a Recruiter
 */
exports.update = function(req, res) {
  var recruiter = req.recruiter;

  recruiter = _.extend(recruiter, req.body);

  recruiter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recruiter);
    }
  });
};

/**
 * Delete an Recruiter
 */
exports.delete = function(req, res) {
  var recruiter = req.recruiter;

  recruiter.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recruiter);
    }
  });
};

/**
 * List of Recruiters
 */
exports.list = function(req, res) {
  Recruiter.find().sort('-created').populate('user', 'displayName').exec(function(err, recruiters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recruiters);
    }
  });
};

/**
 * Recruiter middleware
 */
exports.recruiterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recruiter is invalid'
    });
  }

  Recruiter.findById(id).populate('user', 'displayName').exec(function (err, recruiter) {
    if (err) {
      return next(err);
    } else if (!recruiter) {
      return res.status(404).send({
        message: 'No Recruiter with that identifier has been found'
      });
    }
    req.recruiter = recruiter;
    next();
  });
};
