'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$http', 'Authentication', 'Menus',
  function ($scope, $state, $http, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $scope.sendForm= function(isValid){
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contactForm');

        return false;
      }

      $http.post('api/contactForm', $scope.contactForm).success(function (response) {
        $state.go('home', $state.previous.params);
      }).error(function(response){
        console.log(response);
        $scope.error = response.message;
      });
    };
  }
]);
