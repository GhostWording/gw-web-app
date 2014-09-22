// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'postActionSvc','appUrlSvc',function ($scope,currentLanguage,postActionSvc,appUrlSvc) {
  postActionSvc.postActionInfo('Init','Page','Welcome','Init');

  $scope.isFrench = currentLanguage.isFrenchVersion();

  appUrlSvc.setUserHasBeenOnSplashScreen(true);
}]);