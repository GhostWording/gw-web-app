// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'facebookSvc',function ($scope,currentLanguage,facebookSvc) {

  $scope.isFrench = currentLanguage.isFrenchVersion();

}]);