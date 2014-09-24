angular.module('app/users/FbLoginController', [])
.controller('FbLoginController', ['$scope', '$rootScope','$location','$q','currentUserLocalData','facebookSvc',
function ($scope, $rootScope,$location,$q,currentUserLocalData,facebookSvc) {
  $scope.pageAddress = $location.absUrl();

  $scope.$watch(function() { return facebookSvc.isConnected();},function() {
    //console.log("facebookSvc.isConnected() : " +facebookSvc.isConnected() )
    $scope.loginStatus = facebookSvc.isConnected();
  },true);

  $scope.$watch(function() { return facebookSvc.getCurrentMe();},function() {
    console.log("facebookSvc.getCurrentMe() : " +facebookSvc.getCurrentMe());
    $scope.apiMe = facebookSvc.getCurrentMe();
  },true);

  $scope.$watch(function() { return facebookSvc.getCurrentFamily();},function() {
    console.log("facebookSvc.getCurrentFamily() : " +facebookSvc.getCurrentFamily().length );
    $scope.apiFamily = facebookSvc.getCurrentFamily();
  },true);

  $scope.$watch(function() { return facebookSvc.getCurrentFriends();},function() {
    console.log("facebookSvc.getCurrentFriends() : " +facebookSvc.getCurrentFriends().length );
    $scope.apiFriends = facebookSvc.getCurrentFriends();
  },true);

  $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday();},function() {
    console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +facebookSvc.getSortedFriendsWithBirthday().length );
    $scope.apiFriendsWithBirthday = facebookSvc.getSortedFriendsWithBirthday();
    $scope.apiNextBirthdayFriends =  facebookSvc.getNextBirthdayFriends();
  },true);

$scope.today = Date.now();

  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var year = currentTime.getFullYear();
  //console.log(month + "/" + day + "/" + year);

  $scope.month = month;
  $scope.day = day;

  facebookSvc.updateMe().then(function (me) {
    //$scope.apiMe = me;
  });

  facebookSvc.updateFamily().then(function(family) {
//    $scope.apiFamily = family;
  });




  $scope.login = facebookSvc.fbLogin;
  $scope.logout = facebookSvc.fbLogout;

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


