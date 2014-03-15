angular.module('app/users/UserEMailController', [])

.controller('UserEMailController', ['$scope', 'serverSvc','deviceIdSvc','currentUserLocalData',  function ($scope, serverSvc,deviceIdSvc,currentUserLocalData) {
  console.log(deviceIdSvc.get());
  $scope.user = currentUserLocalData;
  $scope.mailChanged = false;
  $scope.mailSent = false;

  $scope.updateMail = function() {
    $scope.mailChanged = true;
    $scope.mailSent = false;
  };

  $scope.sendMailToServer = function () {
    if ($scope.mailChanged) {

      serverSvc.postInStore('mailStore', deviceIdSvc.get(), $scope.user.email).then(function (response) {
        $scope.mailSent = true;
        $scope.mailChanged = false;
      });

      serverSvc.postMailForVerification($scope.user.email)
      .then(function (response) {
        console.log('mail envoyé : ' + $scope.user.email);
      });
    }
  };
}]);