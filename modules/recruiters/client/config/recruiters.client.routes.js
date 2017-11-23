(function () {
  'use strict';

  angular
    .module('recruiters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('recruiters', {
        abstract: true,
        url: '/recruiters',
        template: '<ui-view/>'
      })
      .state('recruiters.list', {
        url: '',
        templateUrl: 'modules/recruiters/client/views/list-recruiters.client.view.html',
        controller: 'RecruitersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Recruiters List'
        }
      })
      .state('recruiters.create', {
        url: '/create',
        templateUrl: 'modules/recruiters/client/views/form-recruiter.client.view.html',
        controller: 'RecruitersController',
        controllerAs: 'vm',
        resolve: {
          recruiterResolve: newRecruiter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Recruiters Create'
        }
      })
      .state('recruiters.edit', {
        url: '/:recruiterId/edit',
        templateUrl: 'modules/recruiters/client/views/form-recruiter.client.view.html',
        controller: 'RecruitersController',
        controllerAs: 'vm',
        resolve: {
          recruiterResolve: getRecruiter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Recruiter {{ recruiterResolve.name }}'
        }
      })
      .state('recruiters.view', {
        url: '/:recruiterId',
        templateUrl: 'modules/recruiters/client/views/view-recruiter.client.view.html',
        controller: 'RecruitersController',
        controllerAs: 'vm',
        resolve: {
          recruiterResolve: getRecruiter
        },
        data: {
          pageTitle: 'Recruiter {{ recruiterResolve.name }}'
        }
      });
  }

  getRecruiter.$inject = ['$stateParams', 'RecruitersService'];

  function getRecruiter($stateParams, RecruitersService) {
    return RecruitersService.get({
      recruiterId: $stateParams.recruiterId
    }).$promise;
  }

  newRecruiter.$inject = ['RecruitersService'];

  function newRecruiter(RecruitersService) {
    return new RecruitersService();
  }
}());
