// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'myfb',function ($scope,currentLanguage,myfb) {

  $scope.isFrench = currentLanguage.isFrenchVersion();

}]);