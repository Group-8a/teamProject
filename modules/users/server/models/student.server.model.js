var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var studentSchema = new Schema({
  name: {
    type: String
  }
  // name: {
  //   firstName: {
  //     type: String,
  //     required: true
  //   },
  //   lastName: {
  //     type: String,
  //     required: true
  //   },
  //   show: {
  //     type: Boolean
  //   }
  // },
  // cellNumber: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true
  // },
  // major: {
  //   type: String,
  //   required: true
  // },
  // gradDate: {
  //   semester: {
  //     type: String,
  //     required: true
  //   },
  //   year: {
  //     type: Number,
  //     required: true
  //   }
  // }
  // email: {type: String, required: true, unique: true},
  // description: {type: String},
  // altEmail: {type: String, required: true},
  // linkedin: {type: String, required: true},
  // headshot: {data: String, type: String},
  // updates: [String],
  // created_at: Date,
  // updated_at: Date,
  // username: {type: String, required: true, unique: true},
  // password: {type: String, required: true, unique: true} //Hash this value

});

studentSchema.pre('save', function(next) {
  'use strict';
  // var currentDate = new Date;
  // this.updated_at = currentDate;
  // if (!this.created_at) {
  //   this.created_at = currentDate;
  // }
  next();
});

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
