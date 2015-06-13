angular.module('app/users/UserProfileController', [])

.controller('UserProfileController', ['$scope', 'currentUser', 'currentUserLocalData', 'userAges', 'localStorage','deviceIdSvc','serverSvc','currentLanguage','facebookSvc',
function ($scope, currentUser,currentUserLocalData, userAges,localStorage,deviceIdSvc,serverSvc,currentLanguage,facebookSvc) {
  $scope.currentUser = currentUser;
  $scope.userAges = userAges;
  $scope.user = currentUserLocalData;

  $scope.sendEmails = true;
  $scope.mailDeleted = false;

  $scope.connectToFacebook = facebookSvc.fbLogin;
  $scope.$watch(function() { return facebookSvc.isConnected();},function() {
    $scope.isConnectedToFacebook = facebookSvc.isConnected();
  },true);


  $scope.userHasEmail = function() {
    return !!$scope.user.email;
  };

  $scope.setEmailingStatus = function(value) {
    $scope.sendEmails = value;
    if (!!$scope.user.email) {
      if (value)
        serverSvc.changeSubscription($scope.user.email,'enable');
      else
        serverSvc.changeSubscription($scope.user.email,'disable ');
    }

  };
  $scope.unsubscribe = function() {
    $scope.sendEmails = false;
    if (!!$scope.user.email)
      serverSvc.changeSubscription($scope.user.email,'unsubscribe')
      .then(function() {
        console.log("done");
        $scope.user.email = undefined;
        currentUserLocalData.email = '';
        $scope.mailDeleted = true;
      });
  };

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
    serverSvc.sendCultureAndMailToServer(deviceIdSvc.get(), $scope.user.email, currentLanguage.getCultureCode());
  };
}]);