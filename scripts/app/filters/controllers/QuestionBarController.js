angular.module('app/filters/QuestionBarController', [])

.controller('QuestionBarController', ['$scope','currentUser','filtersSvc','currentLanguage','questionBarSvc',
function($scope,currentUser,filtersSvc,currentLanguage,questionBarSvc) {
  var filters = $scope.filters = filtersSvc.filters;

  $scope.currentUser = currentUser;
  $scope.questionBar = questionBarSvc;

  $scope.canHaveSeveralRecipientsforCurrentArea = filtersSvc.canHaveSeveralRecipientsforCurrentArea;

  $scope.currentLanguageHasTVDistinction = function() {
    return currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode());
  };
}]);