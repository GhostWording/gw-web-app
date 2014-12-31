angular.module('app/controllers/NavBarController', [])

.controller('NavBarController',  ['$scope','appUrlSvc','currentLanguage','favouritesSvc', function($scope,appUrlSvc,currentLanguage,favouritesSvc) {
  if ( !$scope.app) {
    $scope.app = {};
    $scope.app.appUrlSvc = appUrlSvc;
  }

  $scope.changeLanguage = function (langKey) {
    currentLanguage.setLanguageCode(langKey,true);
  };

  $scope.getLanguage = function() {
    var l =currentLanguage.getLanguageCode();
    return currentLanguage.getLanguageCode();
  };

  $scope.hasFavourite = function()  {
    return favouritesSvc.hasFavourite();
  };
}]);
