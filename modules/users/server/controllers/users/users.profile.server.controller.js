'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Student = mongoose.model('Student');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var student = req.student;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (student) {
    // Merge existing user
    student = _.extend(student, req.body);
    student.updated = Date.now();
    student.displayName = student.firstName + ' ' + student.lastName;

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
            res.json(student);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var student = req.student;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (student) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        student.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        student.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(student, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(student);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.student || null);
};
