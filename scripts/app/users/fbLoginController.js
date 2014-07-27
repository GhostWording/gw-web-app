angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', 'currentUser','ezfb','$rootScope','$location', function ($scope, currentUser,ezfb,$rootScope,$location) {

  $scope.pageAddress = $location.absUrl();
  //$scope.isLoggedIn = false;

  updateLoginStatus(updateApiMe);

  $scope.login = function () {
    ezfb.login(function (res) {
      if (res.authResponse) {
        updateLoginStatus(updateApiMe);
      }
    }, {scope: 'email'});
  };

  //
  var autoToJSON = ['loginStatus', 'apiMe'];
  angular.forEach(autoToJSON, function (varName) {
    $scope.$watch(varName, function (val) {
      $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
    }, true);
  });

  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;

      (more || angular.noop)();
    });
  }

  function updateApiMe () {
    ezfb.api('/me', function (res) {
      $scope.apiMe = res;
    });
  }

  $scope.logout = function() {
    //FB.logout(); //  Refused to display 'https://www.facebook.com/home.php' in a frame because it set 'X-Frame-Options' to 'DENY'.
    ezfb.logout(function () {
      //updateLoginStatus(updateApiMe);
      console.log("try to log out");
    });
  };

  $scope.fbShare = function () {
    var url = $location.absUrl();
    console.log(url);
    ezfb.ui(
    {
      method: 'feed',
      name: $rootScope.pageTitle1 + " " + $rootScope.pageTitle2,
      picture: 'http://www.commentvousdire.com/assets/TouchWordingCompressed.png',
      link: url,
      description: $rootScope.pageDescription
    },function (res) {});
  };

  $scope.fbSend = function () {
    var url = $location.absUrl();
    //console.log(url);
    ezfb.ui({
      method: 'send',
      name: $rootScope.pageTitle1 + " " + $rootScope.pageTitle2,
      picture: 'http://www.commentvousdire.com/assets/TouchWordingCompressed.png',
      link: url,
      description: $rootScope.pageDescription
    },function (res) { console.log(res);} );
  };

  // Send to full page inside facbook, Does not work on mobiles
  $scope.sendLink = function() {
  var url = $location.absUrl();
  var v =  "http://www.facebook.com/dialog/send?app_id=" + "582577148493403" + "&link=" + url + "&redirect_uri=" + url;
    console.log(v);
    return v;
  };
}]);


//  $scope.login = function() {
//    $facebook.login().then(function() {
//      refresh();
//    });
//  };

//  function refresh() {
//    $facebook.api("/me").then(
//    function(response) {
//      $scope.welcomeMsg = "Welcome " + response.name;
//      $scope.isLoggedIn = true;
//      console.log(response);
//    },
//    function(err) {
//      $scope.welcomeMsg = "Please log in";
//    });
//  }

//  $rootScope.$on("fb.auth.authResponseChange", function(response,fb) {
//  console.log(response);
//  console.log(fb.authResponse);
//  });

//  refresh();
//
//  $facebook.getLoginStatus().then(function(response) {
////    console.log(response);
//    FB.XFBML.parse(); // fb sdk must be initialised before FB can be mentionned
//  } );

