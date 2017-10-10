'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  Student = require('../models/student.server.model.js'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res) {
  console.log("here");
  console.log(req);
  var student = new Student({
    //Work with form data
  });

  student.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      console.log(student);
      res.json(student);
    }
  });

};

exports.update = function(req, res) {
  //Not Sure we need this

};

exports.delete = function(req, res) {
  //Not sure we need this
};

// var mongoose = require('mongoose'),
//     Listing = require('../models/listings.server.model.js');
//
//
// exports.create = function() {
//   console.log("This create");
//   var student = new Student();
//
//   }
