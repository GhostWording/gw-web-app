angular.module('app/users/UserEMailValidationController', [])

.controller('UserEMailValidationController', ['$scope', 'currentUserLocalData','postActionSvc',  function ($scope, currentUserLocalData,postActionSvc) {
  $scope.user = currentUserLocalData;

  postActionSvc.postActionInfo('Init','Page','UserRegistered','Init');


}]);