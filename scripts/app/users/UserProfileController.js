angular.module('app/users/UserProfileController', [])

.controller('UserProfileController', ['$scope', 'currentUser', 'userAges', function ($scope, currentUser, userAges) {
  $scope.currentUser = currentUser;
  $scope.userAges = userAges;

}]);