angular.module('app/users/UserEMailController', [])

.controller('UserEMailController', ['$scope', 'serverSvc','deviceIdSvc','currentUserLocalData','currentLanguage','postActionSvc','facebookSvc',  function ($scope, serverSvc,deviceIdSvc,currentUserLocalData,currentLanguage,postActionSvc,facebookSvc) {
  console.log(deviceIdSvc.get());
  $scope.user = currentUserLocalData;
  $scope.mailChanged = false;
  $scope.mailSent = false;

  // Login
  $scope.fbLogin = facebookSvc.fbLogin;

  $scope.$watch(function() { return facebookSvc.isConnected();},function() {
    $scope.isConnected = facebookSvc.isConnected();
  },true);

  $scope.$watch(function() { return facebookSvc.getCurrentMe();},function() {
    console.log("facebookSvc.getCurrentMe() : " +facebookSvc.getCurrentMe());
    $scope.apiMe = facebookSvc.getCurrentMe();
    console.log("$scope.user.email : "  + $scope.user.email);
    $scope.sendMailToServer();
  },true);


  postActionSvc.postActionInfo('Init','Page','UserEmail','Init');


  $scope.updateMail = function() {
    $scope.mailChanged = true;
    $scope.mailSent = false;
  };

  $scope.sendMailToServer = function () {

    console.log("$scope.user.email : "  + $scope.user.email);
    console.log("currentUserLocalData.email : "  + currentUserLocalData.email);

    if ( ! $scope.user.email ) {
      console.log("$scope.user.email not set");
      return;
    }

//    // Post new email to server
//    serverSvc.postInStore('mailStore', deviceIdSvc.get(), $scope.user.email)
//      // Send preferred culture to server
//    .then(function() {
//      serverSvc.postInStore('preferredCulture', deviceIdSvc.get(), currentLanguage.getCultureCode());
//    })
//      // Ask server to send verification email
//    .then(function() {
//      serverSvc.postMailForVerification($scope.user.email);
//    })
//    .then(function (response) {
//      $scope.mailSent = true;
//      $scope.mailChanged = false;
//    })
//    ;

    serverSvc.sendCultureAndMailToServer(deviceIdSvc.get(), $scope.user.email, currentLanguage.getCultureCode())
    .then(function (response) {
      $scope.mailSent = true;
      $scope.mailChanged = false;
    })
    ;

    // Ask server to send verification email
//    serverSvc.postMailForVerification($scope.user.email)
//    .then(function (response) {
//      //console.log('mail envoyé : ' + $scope.user.email);
//    });
    // Send preferred culture to server
//    serverSvc.postInStore('preferredCulture', deviceIdSvc.get(), currentLanguage.getCultureCode()).then(function (response) {
//      //console.log(response);
//    });

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