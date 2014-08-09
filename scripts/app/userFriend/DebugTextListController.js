angular.module('app/userFriend/UserFriendTextListController', [])
.controller('UserFriendTextListController', ['$scope', 'HelperSvc', 'currentUserFriendSvc',
  function ($scope, HelperSvc,  currentUserFriendSvc) {

    $scope.$watch(function() { return currentUserFriendSvc.getCurrentUserFriend();}, function(userFriend) {
      if ( !!userFriend ) { $scope.filteredMessageList = userFriend.filteredTextList; }
    },true);

  }]);
