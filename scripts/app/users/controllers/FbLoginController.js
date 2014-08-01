angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', 'ezfb','$rootScope','$location','$q','currentUserLocalData','facebookSvc',
function ($scope, ezfb,$rootScope,$location,$q,currentUserLocalData,facebookSvc) {
  $scope.pageAddress = $location.absUrl();

  //updateLoginStatus();//.then(updateApiCall);//.then(updateFriendCall)

  facebookSvc.updateMe().then(function (me) {
    $scope.apiMe = me;
    $scope.loginStatus = facebookSvc.isConnected();
    console.log("Me updated");
  });
  facebookSvc.updateFamily().then(function(family) {
    console.log("Family updated");
    $scope.apiFamilyData = family;
  });
  facebookSvc.updateFriends().then(function(friendList) {
    console.log("Friends updated");
    $scope.apiFriendsData = friendList;
  });

  function updateFamilyCall () {
    // For demo : wait for severa api calls to return
    console.log("Update Family Call");
      return ezfb.api('/me/family?fields=id,name,birthday,gender,relationship')
    .then(function (res) {
      //console.log(res);
      $scope.apiFamilyData = res.data;
    });
  }

//  // TODO : this should be donne in a service
//  //   Subscribe to 'auth.statusChange' event to response to login/logout
//  ezfb.Event.subscribe('auth.statusChange', function (statusRes) {
//    console.log("auth.statusChange : "+ statusRes.status);
//    facebookSvc.updateMe();
//    facebookSvc.updateFriends();
//    facebookSvc.updateFamily();
//  });

  // For generating better looking JSON results
  var autoToJSON = ['loginStatus', 'apiMe','apiFriendsData','apiFamilyData'];
  angular.forEach(autoToJSON, function (varName) {
    $scope.$watch(varName, function (val) {
      $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
      //$scope[varName] = val;
    }, true);
  });

  $scope.login = facebookSvc.fbLogin;
  $scope.logout = facebookSvc.fbLogout;

//  $scope.login= function () {
//    ezfb.login(function (res) {console.log(res); }, {scope: 'user_likes,user_friends,friends_birthday,user_relationships,email'}
//    );
//  };
//  $scope.logout = function () {
//    ezfb.logout();
//    /**
//     * In the case you need to use the callback
//     *
//     * ezfb.logout(function (res) {
//     *   // Executes 1
//     * })
//     * .then(function (res) {
//     *   // Executes 2
//     * })
//     */
//  };

//// Send to full page inside facbook, Does not work on mobiles
//$scope.sendLink = function() {
//  var url = $location.absUrl();
//  var v =  "http://www.facebook.com/dialog/send?app_id=" + "582577148493403" + "&link=" + url + "&redirect_uri=" + url;
//  console.log(v);
//  return v;
//};
//


}]);

// Those will work only if the page has been previously parsed by facebook crawler
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


