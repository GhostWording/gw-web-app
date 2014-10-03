angular.module('app/users/UserProfileController', [])

.controller('UserProfileController', ['$scope', 'currentUser', 'currentUserLocalData', 'userAges', 'localStorage','deviceIdSvc','serverSvc','currentLanguage',
function ($scope, currentUser,currentUserLocalData, userAges,localStorage,deviceIdSvc,serverSvc,currentLanguage) {
  $scope.currentUser = currentUser;
  $scope.userAges = userAges;
  $scope.user = currentUserLocalData;

  $scope.clearAll = function() {
    // We want to delete everything but the deviceId
    localStorage.clearAllExceptThis(deviceIdSvc.get());

    currentUser.gender = null;
    currentUser.readsAlot =  null;
    currentUser.age = null;
    currentUser.isDemonstrative = null;
    currentUser.clear();
  };


  $scope.sendMailToServer = function () {

    // Should move that in a service and share with userEmail
    serverSvc.postInStore('mailStore', deviceIdSvc.get(), $scope.user.email)
    .then(function (response) {
    })
      // Ask server to send verification email
    .then(function () {
      serverSvc.postMailForVerification($scope.user.email);
    })
      // Send preferred culture to server
    .then(function () {
      serverSvc.postInStore('preferredCulture', deviceIdSvc.get(), currentLanguage.getCultureCode());
    });

  };
}]);