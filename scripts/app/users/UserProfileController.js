angular.module('app/users/UserProfileController', [])

.controller('UserProfileController', ['$scope', 'currentUser', 'userAges', 'localStorage','deviceIdSvc', function ($scope, currentUser, userAges,localStorage,deviceIdSvc) {
  $scope.currentUser = currentUser;
  $scope.userAges = userAges;

  $scope.clearAll = function() {
    var deviceId = deviceIdSvc.get();
    localStorage.clearAll(deviceId);
    // We want to delete everything but the deviceId
    //console.log("deviceId restored : " + deviceId);
    //deviceIdSvc.storeAgain(deviceId);

    currentUser.gender = null;
    currentUser.readsAlot =  null;
    currentUser.age = null;
    currentUser.isDemonstrative = null;
    currentUser.clear();
  };
}]);