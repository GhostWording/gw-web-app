angular.module('app/users/UserEMailController', [])

.controller('UserEMailController', ['$scope', 'serverSvc','deviceIdSvc','currentUserLocalData','currentLanguage','postActionSvc',  function ($scope, serverSvc,deviceIdSvc,currentUserLocalData,currentLanguage,postActionSvc) {
  console.log(deviceIdSvc.get());
  $scope.user = currentUserLocalData;
  $scope.mailChanged = false;
  $scope.mailSent = false;

  postActionSvc.postActionInfo('Init','Page','UserEmail','Init');


  $scope.updateMail = function() {
    $scope.mailChanged = true;
    $scope.mailSent = false;
  };

  $scope.sendMailToServer = function () {

    // Post new email to server
    serverSvc.postInStore('mailStore', deviceIdSvc.get(), $scope.user.email).then(function (response) {
      $scope.mailSent = true;
      $scope.mailChanged = false;
    });


    // Ask server to send verification email
    serverSvc.postMailForVerification($scope.user.email)
    .then(function (response) {
      //console.log('mail envoyé : ' + $scope.user.email);
    });
    // Send preferred culture to server
    serverSvc.postInStore('preferredCulture', deviceIdSvc.get(), currentLanguage.getCultureCode()).then(function (response) {
      //console.log(response);
    });

//    console.log("$scope.userMail.input.$valid " + $scope.userMail.input.$valid);
//    console.log("$scope.userMail.input.$error " + $scope.userMail.input.$error);
//    console.log("$scope.userMail.input " + $scope.userMail.input);
//    return;
//
//    $scope.mailSent = true;
//    $scope.mailChanged = false;
//    console.log("FAAAAAAAKE EMAIL");

  };
}]);