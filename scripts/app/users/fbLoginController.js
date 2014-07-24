angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', 'currentUser','$facebook','$location', function ($scope, currentUser,$facebook,$location) {


  //$scope.pageAddress = $location.url();
  $scope.pageAddress = "beta.commentvousdire.com";

  $scope.isLoggedIn = false;

  $scope.login = function() {
    $facebook.login().then(function() {
      refresh();
    });
  };
  $scope.logout = function() {
    $facebook.logout(); //  Refused to display 'https://www.facebook.com/home.php' in a frame because it set 'X-Frame-Options' to 'DENY'.
  };

  function refresh() {
    $facebook.api("/me").then(
    function(response) {
      $scope.welcomeMsg = "Welcome " + response.name;
      $scope.isLoggedIn = true;
      console.log(response);
    },
    function(err) {
      $scope.welcomeMsg = "Please log in";
    });
  }
$facebook.$on(fb.auth.login, function(response) {
  console.log(response);
})

  refresh();
  }]);
