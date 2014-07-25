angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', 'currentUser','$facebook','$rootScope', function ($scope, currentUser,$facebook,$rootScope) {


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

  $rootScope.$on("fb.auth.authResponseChange", function(response,fb) {
  console.log(response);
  console.log(fb.authResponse);
  });

  refresh();

  $facebook.getLoginStatus().then(function(response) {
    console.log(response);
    FB.XFBML.parse(); // fb sdk must be initialised before FB can be mentionned
  } );
//  if ( FB !== null && FB !== undefined && !!FB.XFBML )
//    $facebook.resolve(FB);
//    FB.XFBML.parse(); // call

}]);
