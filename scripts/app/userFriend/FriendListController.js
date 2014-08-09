angular.module('app/userFriend/FriendListController', [])
.controller('FriendListController', ['$scope', 'HelperSvc', 'currentUserFriendSvc',
  function ($scope, HelperSvc,  currentUserFriendSvc) {

    $scope.friendList = ['a','b','c'];

  }]);
