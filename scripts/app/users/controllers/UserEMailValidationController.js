angular.module('app/users/UserEMailValidationController', [])

.controller('UserEMailValidationController', ['$scope', 'currentUserLocalData',  function ($scope, currentUserLocalData) {
  $scope.user = currentUserLocalData;


}]);