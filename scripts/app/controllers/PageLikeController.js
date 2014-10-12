angular.module('app/controllers/PageLikeController', [])

.controller('PageLikeController', ['$scope','currentLanguage', function ($scope,currentLanguage) {
  $scope.isFrench = currentLanguage.isFrenchVersion();
}]);
