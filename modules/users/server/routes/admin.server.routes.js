'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  student= require('../controllers/student.server.controller'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  app.route('/api/admin/removeUser').post(admin.removeUser);

  app.route('/test')
    .post(student.create);
  // Finish by binding the user middleware
  //app.route('/api/invite')
    //.post(adminPolicy.isAllowed, admin.sendInvite);

  app.param('userId', admin.userByID);

};
