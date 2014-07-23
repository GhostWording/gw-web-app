angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', 'currentUser','$facebook', function ($scope, currentUser,$facebook) {

  $scope.isLoggedIn = false;

  $scope.login = function() {
    $facebook.login().then(function() {
      refresh();
    });
  };

  function refresh() {
    $facebook.api("/me").then(
    function(response) {
      $scope.welcomeMsg = "Welcome " + response.name;
      $scope.isLoggedIn = true;
    },
    function(err) {
      $scope.welcomeMsg = "Please log in";
    });
  }

  refresh();
  }]);
