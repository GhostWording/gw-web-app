// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', function ($scope,currentLanguage) {

  $scope.isFrench = currentLanguage.isFrenchVersion();
}]);