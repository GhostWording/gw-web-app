// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope', 'appUrlSvc', function ($scope,appUrlSvc) {
  $scope.appUrlSvc = appUrlSvc;
}]);