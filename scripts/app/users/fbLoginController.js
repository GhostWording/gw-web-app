angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', 'currentUser','ezfb','$rootScope','$location','$q', function ($scope, currentUser,ezfb,$rootScope,$location,$q) {
  $scope.pageAddress = $location.absUrl();

  //updateMe();
  updateLoginStatus();//.then(updateApiCall);

  function updateMe () {
    ezfb.getLoginStatus()
    .then(function (res) {
      // https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
      //console.log(res);
      return ezfb.api('/me');
    })
    .then(function (me) {
      // https://developers.facebook.com/docs/javascript/reference/FB.api
      //console.log(me);
      $scope.me = me;
    });
  }

  function updateLoginStatus () {
    return ezfb.getLoginStatus()
    .then(function (res) {
      $scope.loginStatus = res;
    });
  }
  function updateFamilyCall () {
    // For demo : wait for severa api calls to return
    console.log("Update Family Call");
      return ezfb.api('/me/family?fields=id,name,birthday,gender,relationship')
    .then(function (res) {
      console.log(res);
      $scope.apiFamily = res;
    });
  }

  function updateFriendCall () {
    // For demo : wait for severa api calls to return
    console.log("Update Friend Call");
    return ezfb.api('/me/friends?fields=id,name,birthday,gender')
    .then(function (res) {
      console.log("NbFriends = " + res.data.length);
      console.log(res);
      $scope.apiFriends = res;
    });
  }

  //   Subscribe to 'auth.statusChange' event to response to login/logout
  ezfb.Event.subscribe('auth.statusChange', function (statusRes) {
    $scope.loginStatus = statusRes;
    console.log("auth.statusChange : "+ statusRes.status);
    updateMe();
    updateFamilyCall();
    updateFriendCall();
  });

  // For generating better looking JSON results
//  var autoToJSON = ['loginStatus', 'apiRes'];
  var autoToJSON = ['loginStatus', 'apiMe','apiFriends','apiFamily'];
  angular.forEach(autoToJSON, function (varName) {
    $scope.$watch(varName, function (val) {
      $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
      $scope[varName] = val;
    }, true);
  });

  $scope.login = function () {
    //ezfb.login(null, {scope: 'email,user_likes,family'});
    ezfb.login(function (res) {console.log(res) }, {scope: 'user_likes,user_friends,friends_birthday,user_relationships'});

    /**
     * In the case you need to use the callback
     * ezfb.login(function (res) {
     *   // Executes 1
     * }, {scope: 'email,user_likes'})
     * .then(function (res) {
     *   // Executes 2
     * })
     *
     * Note that the `res` result is shared.
     * Changing the `res` in 1 will also change the one in 2
     */
  };

  $scope.logout = function () {
    ezfb.logout();
    /**
     * In the case you need to use the callback
     *
     * ezfb.logout(function (res) {
     *   // Executes 1
     * })
     * .then(function (res) {
     *   // Executes 2
     * })
     */
  };


}]);


//function updateLoginStatus (more) {
//  ezfb.getLoginStatus(function (res) {
//    $scope.loginStatus = res;
//
//    (more || angular.noop)();
//  });
//}
//
//
//updateLoginStatus(updateApiMe);
//
//$scope.login = function () {
//  ezfb.login(function (res) {
//    if (res.authResponse) {
//      updateLoginStatus(updateApiMe);
//    }
//  }, {scope: 'email'});
//};
//
////
//var autoToJSON = ['loginStatus', 'apiMe'];
//angular.forEach(autoToJSON, function (varName) {
//  $scope.$watch(varName, function (val) {
//    $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
//  }, true);
//});
//
//
//function updateApiMe () {
//  ezfb.api('/me', function (res) {
//    $scope.apiMe = res;
//  });
//}
//
//$scope.logout = function() {
//  //FB.logout(); //  Refused to display 'https://www.facebook.com/home.php' in a frame because it set 'X-Frame-Options' to 'DENY'.
//  ezfb.logout(function () {
//    //updateLoginStatus(updateApiMe);
//    console.log("try to log out");
//  });
//};
//
//$scope.fbShare = function () {
//  var url = $location.absUrl();
//  console.log(url);
//  ezfb.ui(
//  {
//    method: 'feed',
//    name: $rootScope.pageTitle1 + " " + $rootScope.pageTitle2,
//    picture: 'http://www.commentvousdire.com/assets/TouchWordingCompressed.png',
//    link: url,
//    description: $rootScope.pageDescription
//  },function (res) {});
//};
//
//$scope.fbSend = function () {
//  var url = $location.absUrl();
//  //console.log(url);
//  ezfb.ui({
//    method: 'send',
//    name: $rootScope.pageTitle1 + " " + $rootScope.pageTitle2,
//    picture: 'http://www.commentvousdire.com/assets/TouchWordingCompressed.png',
//    link: url,
//    description: $rootScope.pageDescription
//  },function (res) { console.log(res);} );
//};
//
//// Send to full page inside facbook, Does not work on mobiles
//$scope.sendLink = function() {
//  var url = $location.absUrl();
//  var v =  "http://www.facebook.com/dialog/send?app_id=" + "582577148493403" + "&link=" + url + "&redirect_uri=" + url;
//  console.log(v);
//  return v;
//};
//

////

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

