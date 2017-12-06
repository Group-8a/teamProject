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
  firstName: {
    type: String,
    trim: true,
    default: '',
  },
  last: {
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    lastNameDontShow: {
      type: Boolean,
      trim: true,
      default: false
    }
  },
  primaryEmail: {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    emailDontShow: {
      type: Boolean,
      default: false
    }
  },
  secondaryEmail: {
    email: {
      type: String,
      default: ''
    },
    secondaryEmailDontShow: {
      type: Boolean,
      default: false
    }
  },
  major: {
    major: {
      type: String,
      default: ''
    },
    majorDontShow: {
      type: Boolean,
      default: false
    }
  },
  gradDate: {
    date: {
      type: Date,
      default: ''
    },
    dateDontShow: {
      type: Boolean,
      default: false
    }
  },
  linkedin: {
    url: {
      type: String,
      default: ''
    },
    linkedinDontShow: {
      type: Boolean,
      default: false
    }
  },
  joinLab: {
    type: Date,
  },
  updated: {
    type: Date
  },
  projects : {
    subjuGator: {
      type: Boolean,
      default: false
    },
    propaGator: {
      type: Boolean,
      default: false
    },
    naviGator: {
      type: Boolean,
      default: false
    },
    mil: {
      type: Boolean,
      default: true
    }
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Recruiter', RecruiterSchema);
