angular.module('app/users/UserProfileController', [])

.controller('UserProfileController', ['$scope', 'currentUser', 'userAges', 'localStorage', function ($scope, currentUser, userAges,localStorage) {
  $scope.currentUser = currentUser;
  $scope.userAges = userAges;

  $scope.clearAll = function() {
    localStorage.clearAll();

    currentUser.gender = null;
    currentUser.readsAlot =  null;
    currentUser.age = null;
    currentUser.isDemonstrative = null;
    currentUser.clear();
  };
}]);