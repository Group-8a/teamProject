(function () {
  'use strict';

  angular
    .module('recruiters')
    .controller('RecruitersListController', RecruitersListController);

  RecruitersListController.$inject = ['RecruitersService'];

  function RecruitersListController(RecruitersService) {
    var vm = this;

    vm.recruiters = RecruitersService.query();


  }






}());
