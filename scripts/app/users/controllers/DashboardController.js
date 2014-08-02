angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','$location','currentUserLocalData','facebookSvc',
  function ($scope, ezfb,$location,currentUserLocalData,facebookSvc) {

    $scope.fbLogin = facebookSvc.fbLogin;

    $scope.$watch(function() { return facebookSvc.isConnected();},function() {
      $scope.isConnected = facebookSvc.isConnected();
    },true);
//
//    $scope.$watch(function() { return facebookSvc.getCurrentMe();},function() {
//      console.log("facebookSvc.getCurrentMe() : " +facebookSvc.getCurrentMe());
//      $scope.apiMe = facebookSvc.getCurrentMe();
//    },true);
//
//    $scope.$watch(function() { return facebookSvc.getCurrentFamily();},function() {
//      console.log("facebookSvc.getCurrentFamily() : " +facebookSvc.getCurrentFamily().length );
//      $scope.apiFamily = facebookSvc.getCurrentFamily();
//    },true);
//
//    $scope.$watch(function() { return facebookSvc.getCurrentFriends();},function() {
//      console.log("facebookSvc.getCurrentFriends() : " +facebookSvc.getCurrentFriends().length );
//      $scope.apiFriends = facebookSvc.getCurrentFriends();
//    },true);
//
    $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday();},function() {
      console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +facebookSvc.getSortedFriendsWithBirthday().length );
      $scope.apiFriendsWithBirthday = facebookSvc.getSortedFriendsWithBirthday();
      $scope.apiNextBirthdayFriends =  facebookSvc.getNextBirthdayFriend();
    },true);
//
//    $scope.today = Date.now();
//
//    var currentTime = new Date();
//    var month = currentTime.getMonth() + 1;
//    var day = currentTime.getDate();
//    var year = currentTime.getFullYear();
//    //console.log(month + "/" + day + "/" + year);
//
//    console.log(currentTime.toDateString);
//
//    $scope.month = month;
//    $scope.day = day;
//
//
//    facebookSvc.updateMe().then(function (me) {
//      //$scope.apiMe = me;
//    });
//
//    facebookSvc.updateFamily().then(function(family) {
////    $scope.apiFamily = family;
//    });
//
//    $scope.login = facebookSvc.fbLogin;
//    $scope.logout = facebookSvc.fbLogout;
//



  }]);