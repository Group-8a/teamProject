'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Recruiters Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/recruiters',
      permissions: '*'
    }, {
      resources: '/api/recruiters/:recruiterId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/recruiters',
      permissions: ['get', 'post']
    }, {
      resources: '/api/recruiters/:recruiterId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/recruiters',
      permissions: ['get']
    }, {
      resources: '/api/recruiters/:recruiterId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Recruiters Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Recruiter is being processed and the current user created it then allow any manipulation
  if (req.recruiter && req.user && req.recruiter.user && req.recruiter.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
