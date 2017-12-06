
'use strict';

angular.module('recruiters').controller('RecruitersListController',['RecruitersService', '$scope',
//RecruitersListController.$inject = ['RecruitersService', '$scope'];
function (RecruitersService, $scope) {
  //RecruitersListController.$inject = ['RecruitersService']
  var vm = this;
  $scope.searchUsersText = undefined;
  $scope.projects = "hey";
  vm.recruiters = RecruitersService.query();

  $scope.searchUsers = function(recruiters){
    var name = recruiters.firstName.toLowerCase();
    //var projects = recruiters.projects;
    //var major = recruiters.major.major;
    //console.log(recruiters);
    if($scope.searchUsersText !== undefined && $scope.searchUsersText !== ''){
      $scope.searchUsersText = $scope.searchUsersText.toLowerCase();
      var matched = name.includes($scope.searchUsersText);
      if(matched === true) {
        return true;
      }
      if('subjugator'.includes($scope.searchUsersText) ===true && recruiters.projects.subjuGator === true){
        return true;
      }
      if('propagator'.includes($scope.searchUsersText) === true && recruiters.projects.propaGator === true){
        return true;
      }
      if('navigator'.includes($scope.searchUsersText) === true && recruiters.projects.naviGator === true){
        return true;
      }
      if('mil'.includes($scope.searchUsersText)){
        return true;
      }
      if(recruiters.last.lastNameDontShow === false && recruiters.last.lastName !== null){
        var lname = recruiters.last.lastName.toLowerCase();
        matched = lname.includes($scope.searchUsersText);
        if (matched === true){
          return true;
        }
      }
      if(recruiters.major.majorDontShow === false && recruiters.major.major !== null){
        var m = recruiters.major.major.toLowerCase();
        matched = m.includes($scope.searchUsersText);
        if (matched === true){
          return true;
        }
      }
      return false;
    }
    return true;
  };

  $scope.getProjects = function(recruiter){
    //make project easy to read
    $scope.projects = [];
    //console.log(recruiter.projects);
    if(recruiter.projects.subjuGator === true){
      $scope.projects.push(' subjuGator');
    }
    if(recruiter.projects.propaGator === true){
      $scope.projects.push(' propaGator');
    }
    if(recruiter.projects.naviGator === true){
      $scope.projects.push(' naviGator');
    }
    //console.log($scope.projects);
  };
}
]);
