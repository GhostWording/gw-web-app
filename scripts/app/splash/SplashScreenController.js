// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'postActionSvc',function ($scope,currentLanguage,postActionSvc) {

  postActionSvc.postActionInfo('Init','Page','Welcome','Init');


  $scope.isFrench = currentLanguage.isFrenchVersion();

}]);