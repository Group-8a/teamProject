'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;

    $scope.changeDates = function(){
      var date = $scope.user.gradDate.date;
      if (date !== null && date !== undefined){
        $scope.gradDate = date.substring(0, 10);
        var parts = $scope.gradDate.split('-');
        $scope.gradDate = parts[1] + '/' + parts[2] + '/'+ parts[0];
      }
      var jdate = $scope.user.joinLab;
      if (jdate !== null && jdate !== undefined){
        $scope.joinDate = jdate.substring(0, 10);
        var jparts = $scope.joinDate.split('-');
        $scope.joinDate = jparts[1] + '/' + jparts[2] + '/'+ jparts[0];
      }
    //make project easy to read
      $scope.projects = [];
      console.log($scope.user.projects);
      if($scope.user.projects.subjuGator === true){
        $scope.projects.push(' subjuGator');
      }
      if($scope.user.projects.propaGator === true){
        $scope.projects.push(' propaGator');
      }
      if($scope.user.projects.naviGator === true){
        $scope.projects.push(' naviGator');
      }
    };
  }
]);
