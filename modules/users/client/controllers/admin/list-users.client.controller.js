'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', '$state', '$http','Users', 'Admin',
  function ($scope, $filter, $state, $http, Users, Admin) {
    $scope.currentUser = undefined;
    $scope.userProfile = false;
    $scope.userBlogs = false;
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.displayDetails = function(index) {
      $scope.detailedInfo = $scope.users[index];
      $scope.currentUser = $scope.users[index];
      $scope.userBlogs = false;
    };

    $scope.returnUser = function(index) {
      $scope.userID = $scope.users[index];
    }; //Added this!!!!

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
    $scope.showProfile = function(){
      $scope.userProfile=true;
    };
    $scope.showBlog = function(){
      $scope.userBlogs=true;
    };
/*
    $scope.makeAdmin = function(){
      if (confirm('Are you sure you want to give this user Administrator privledges?')) {
        if ($scope.currentUser !== undefined) {
          $http.post('/api/admin/makeAdmin', $scope.currentUser).success(function (response) {
            $state.go('admin.users', $state.previos.params);
          }).error(function (response) {
            $scope.error = response.message;
          });
        }
      }
    }; */
    $scope.date = function(index){
      $scope.currentUser = $scope.users[index];
      $scope.gradDate = $scope.currentUser.gradDate.date;
      $scope.joinDate = $scope.currentUser.joinLab;
      if ($scope.gradDate !== null && $scope.gradDate !== undefined){
        $scope.gradDate = $scope.gradDate.substring(0, 10);
      }
      if ($scope.joinDate !== null && $scope.joinDate !== undefined){
        $scope.joinDate = $scope.joinDate.substring(0, 10);
      }
    };
    $scope.remove = function () {
      var user = $scope.currentUser;
      if (confirm('Are you sure you want to delete this user?')) {
        if (user !== undefined) {
          $http.post('/api/admin/removeUser', $scope.currentUser).success(function (response) {
            $state.go($state.previous.state.name || 'home', $state.previous.params);
          }).error(function (response) {
            $scope.error = response.message;
          });
        }
        else{
          alert('Cannot delete user');
        }
      }
    };
    $scope.getProjects = function(index){
      var user = $scope.users[index];
      console.log(user);
      $scope.projects = ['MIL'];
      if(user.projects.subjuGator === true){
        $scope.projects.push(' subjuGator');
      }
      if(user.projects.propaGator === true){
        $scope.projects.push(' propaGator');
      }
      if(user.projects.naviGator === true){
        $scope.projects.push(' naviGator');
      }
    };
    $scope.makeAdmin = function () {
      var user = $scope.currentUser;
      if (confirm('Are you sure you want to give this user Administrator priveledges?')) {
        if (user !== undefined) {
          user.roles = ['admin'];

        }
        else{
          alert('Cannot make user an Admin');
        }
      }
    };
  }
]);
