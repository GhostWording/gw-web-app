angular.module('app/users/UserEMailController', [])

.controller('UserEMailController', ['$scope', 'serverSvc','deviceIdSvc','currentUserLocalData','currentLanguage',  function ($scope, serverSvc,deviceIdSvc,currentUserLocalData,currentLanguage) {
  console.log(deviceIdSvc.get());
  $scope.user = currentUserLocalData;
  $scope.mailChanged = false;
  $scope.mailSent = false;

  $scope.updateMail = function() {
    $scope.mailChanged = true;
    $scope.mailSent = false;
  };

  $scope.sendMailToServer = function () {
    //if ($scope.mailChanged) // email might have been set from facebook profile
    {

      serverSvc.postInStore('mailStore', deviceIdSvc.get(), $scope.user.email).then(function (response) {
        $scope.mailSent = true;
        $scope.mailChanged = false;
      });

      serverSvc.postMailForVerification($scope.user.email)
      .then(function (response) {
        //console.log('mail envoyé : ' + $scope.user.email);
      });

      serverSvc.postInStore('preferredCulture', deviceIdSvc.get(), currentLanguage.getCultureCode()).then(function (response) {
        //console.log(response);
      });

    }
  };
}]);