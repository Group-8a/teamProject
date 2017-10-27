'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
    /*  .state('admin.user-invite', {
        url: '/invite_user',
        templateUrl: 'modules/users/client/views/admin/invite-users.client.view.html',
        controller: 'UserController'
      })*/
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'AuthenticationController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.inviteUsers', {
        url: '/invite_user',
        templateUrl: 'modules/users/client/views/admin/invite-users.client.view.html',
        controller: 'AuthenticationController',
        /*resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }*/
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.invite', {
        url: '/invite',
        templateUrl: 'modules/users/client/views/authentication/invite.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('test', {
        url: '/test',
        templateUrl:'modules/users/client/views/admin/allStudentsView.html',
        //controller: 'UserListController'
        //controller: 'ArticlesController'
      })
      .state('profile', {
        url: '/user',
        templateUrl: 'modules/users/client/views/admin/user-profile.client.view.html',
        controller: 'UserListController'
      });



  }
]);
