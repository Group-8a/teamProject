'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.tags = [];

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content,
        tags: this.tags.split(",")
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.tags = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }
      console.log($scope.article);
      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };

    // On the profile, only show articles that belong to the user logged in
    $scope.filterArticles = function (article) {
      if(article.user.displayName === $scope.user.displayName){
        return true;
      }
      return false;
    };

    $scope.filterByTags = function(article){
      if($scope.tags.length > 0){
        for(var i in $scope.tags){
          if(article.tags.indexOf($scope.tags[i]) !== -1){
            return true;
          }
        }
        return false;
      }
      else{
        return true;
      }
    };

    $scope.addTags = function(tag){
      if(tag !== null){
        //var tags = $scope.article.tags;
        if($scope.tags.indexOf(tag) === -1){
          $scope.tags.push(tag);
        }
      }
    };
    $scope.deleteTags = function(tag){
      if(tag !== null){
        var index = $scope.tags.indexOf(tag);
        if(index !== -1){
          $scope.tags.splice(index);
        }
      }
    };
  }
]);
