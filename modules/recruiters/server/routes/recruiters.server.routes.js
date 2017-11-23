'use strict';

/**
 * Module dependencies
 */
var recruitersPolicy = require('../policies/recruiters.server.policy'),
  recruiters = require('../controllers/recruiters.server.controller');

module.exports = function(app) {
  // Recruiters Routes
  app.route('/api/recruiters').all(recruitersPolicy.isAllowed)
    .get(recruiters.list)
    .post(recruiters.create);

  app.route('/api/recruiters/:recruiterId').all(recruitersPolicy.isAllowed)
    .get(recruiters.read)
    .put(recruiters.update)
    .delete(recruiters.delete);

  // Finish by binding the Recruiter middleware
  app.param('recruiterId', recruiters.recruiterByID);
};
