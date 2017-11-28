
'use strict';

angular.module('recruiters').controller('RecruitersListController',['RecruitersService', '$scope',
//RecruitersListController.$inject = ['RecruitersService', '$scope'];
function (RecruitersService, $scope) {
  //RecruitersListController.$inject = ['RecruitersService']
  var vm = this;
  $scope.searchUsersText = undefined;
  vm.recruiters = RecruitersService.query();

  $scope.searchUsers = function(recruiters){
    var name = recruiters.firstName;
    //var major = recruiters.major.major;
    //console.log(recruiters);
    if($scope.searchUsersText !== undefined && $scope.searchUsersText !== ''){
      var matched = name.includes($scope.searchUsersText);
      if(matched === true) {
        return true;
      }
      if(recruiters.last.lastNameDontShow === false && recruiters.last.lastName !== null){
        matched = recruiters.last.lastName.includes($scope.searchUsersText);
        if (matched === true){
          return true;
        }
      }
      if(recruiters.major.majorDontShow === false && recruiters.major.major !== null){
        matched = recruiters.major.major.includes($scope.searchUsersText);
        if (matched === true){
          return true;
        }
      }
      return false;
    }
    return true;
  };
}
]);
