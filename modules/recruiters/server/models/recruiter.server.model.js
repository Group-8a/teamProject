'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Recruiter Schema
 */
var RecruiterSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Recruiter name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Recruiter', RecruiterSchema);
