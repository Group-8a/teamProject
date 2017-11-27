// Recruiters service used to communicate Recruiters REST endpoints
(function () {
  'use strict';

  angular
    .module('recruiters')
    .factory('RecruitersService', RecruitersService);

  RecruitersService.$inject = ['$resource'];

  function RecruitersService($resource) {
    return $resource('api/recruiters/:recruiterId', {
      recruiterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    console.log(recruiterId);
  }
}());
