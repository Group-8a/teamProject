(function () {
  'use strict';

  // Recruiters controller
  angular
    .module('recruiters')
    .controller('RecruitersController', RecruitersController);

  RecruitersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'recruiterResolve'];

  function RecruitersController ($scope, $state, $window, Authentication, recruiter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.recruiter = recruiter;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;









    // Remove existing Recruiter
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.recruiter.$remove($state.go('recruiters.list'));
      }
    }

    // Save Recruiter
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.recruiterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.recruiter._id) {
        vm.recruiter.$update(successCallback, errorCallback);
      } else {
        vm.recruiter.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('recruiters.view', {
          recruiterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
