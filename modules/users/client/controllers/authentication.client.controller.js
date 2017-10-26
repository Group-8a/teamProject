'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.invite = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'newUserForm');

        return false;
      }
      $http.post('api/auth/invite', $scope.newUser).success(function (response) {
        // If successful we assign the response to the global user model
        //$scope.authentication.user = response;
      // And redirect to the previous or home page
        $http.post('api/auth/sendInvite', $scope.newUser).success(function (response){
          $state.go($state.previous.state.name || 'home', $state.previous.params);
        }).error(function(response){
          $scope.error = response.message;
        });
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function(response){
        $scope.error = response.message;
      });
    };

    $scope.checkforinvite = function () {
      $scope.error = null;

      $http.post('api/auth/sendInvite', $scope.credentials).success(function (response){
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function(response){
        $scope.error = response.message;
      });
    };

    $scope.signup = function (isValid) {
      $scope.error = null;
      $scope.signin(isValid);
      if (!isValid) {

        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      var test =
      { "credentials": $scope.credentials,
        "show": $scope.show };
      $http.put('/api/auth/signup', test).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.inviteSignin = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      $http.post('/api/auth/inviteSignin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        console.log(response);
        if (response[0] === 'True'){
          $state.go('formpage', {
            token: response[1]
          });
        }
        else {
          $scope.error = 'Sorry, invite code and UF id combination does not match our database.';

        }
        // And redirect to the previous or home page
      }).error(function (response) {
        $scope.error = response.message;
      });
    /*  $scope.authentication.user = response;

      // And redirect to the previous or home page
      $state.go('authentication.signup');
    }).error(function (response) {
      $scope.error = response.message;
    });*/
    // OAuth provider request
    };
  }
]);
