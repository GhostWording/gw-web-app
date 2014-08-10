angular.module('app/userDashboard/BoardSectionController', [])
.controller('BoardSectionController', ['$scope', 'HelperSvc', 'currentUserFriendSvc',
  function ($scope, HelperSvc,  currentUserFriendSvc) {

    $scope.friendList = ['a','b','c'];
    console.log($scope.section);

  }]);
