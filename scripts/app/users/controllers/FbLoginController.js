angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', 'ezfb','$rootScope','$location','$q','currentUserLocalData',
  function ($scope, ezfb,$rootScope,$location,$q,currentUserLocalData) {
  $scope.pageAddress = $location.absUrl();

    // hopefully, they will be called when we subscribe to auth.statusChange
  updateMe();
  //updateLoginStatus();//.then(updateApiCall);//.then(updateFriendCall)

  function updateMe () {
    ezfb.getLoginStatus()
    .then(function (res) {
      console.log(res.authResponse.userID);
      return ezfb.api('/me');} )
    .then(function (me)  { $scope.apiMe = me; } );
  }

  function updateLoginStatus () {
    return ezfb.getLoginStatus()
    .then(function (res) {
      $scope.loginStatus = res;
      currentUserLocalData.setFbId($scope.loginStatus.authResponse.userID);
    });
  }
  function updateFamilyCall () {
    // For demo : wait for severa api calls to return
    console.log("Update Family Call");
      return ezfb.api('/me/family?fields=id,name,birthday,gender,relationship')
    .then(function (res) {
      //console.log(res);
      $scope.apiFamilyData = res.data;
    });
  }

  function updateFriendCall () {
    // For demo : wait for severa api calls to return
    console.log("Update Friend Call");
    return ezfb.api('/me/friends?fields=id,name,birthday,gender')
    .then(function (res) {
      var friendList = res.data;
      $scope.apiFriendsData = friendList;
      var nbFriendsStored = currentUserLocalData.nbFriends();
      console.log(currentUserLocalData);
      console.log(currentUserLocalData.fbFriends);
      console.log("currentUser nb friends = " + nbFriendsStored);
      console.log("NbFriends = " + res.data.length);
      // If the last read friend list does not look truncated
      if ( friendList.length >=  nbFriendsStored / 2   ) {
        currentUserLocalData.fbFriends = friendList;
        console.log("stored new friendlist");
      }
    });
  }

  //   Subscribe to 'auth.statusChange' event to response to login/logout
  // TODO : this should be donne in a service and called from app.js
  ezfb.Event.subscribe('auth.statusChange', function (statusRes) {
    $scope.loginStatus = statusRes;
    console.log("auth.statusChange : "+ statusRes.status);
    updateLoginStatus();
    updateMe();
    updateFamilyCall();
    updateFriendCall();
  });

  // For generating better looking JSON results
  var autoToJSON = ['loginStatus', 'apiMe','apiFriendsData','apiFamilyData'];
  angular.forEach(autoToJSON, function (varName) {
    $scope.$watch(varName, function (val) {
      $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
      //$scope[varName] = val;
    }, true);
  });

  $scope.login = function () {
    ezfb.login(function (res) {console.log(res); }, {scope: 'user_likes,user_friends,friends_birthday,user_relationships'}
    );
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


