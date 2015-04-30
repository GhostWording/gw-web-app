angular.module('app/filters/QuestionBarController', [])

.controller('QuestionBarController', ['$scope','currentUser','filtersSvc','currentLanguage','questionBarSvc','filteredTextListSvc',
function($scope,currentUser,filtersSvc,currentLanguage,questionBarSvc,filteredTextListSvc) {

  //var filters = $scope.filters = filtersSvc.filters;

  $scope.filters = filtersSvc.filters;
  
  $scope.currentUser = currentUser;
  $scope.questionBar = questionBarSvc;

  // TODO : move those in questionBarSvc
  $scope.recipientGenderCanHelpChooseTexts = function() {
   return   filteredTextListSvc.getTextCountForPropertyValue('Target','H') > 2 ||
            filteredTextListSvc.getTextCountForPropertyValue('Target','F') > 2 ||
            filteredTextListSvc.getTextCountForPropertyValue('Target','P') > 2;
  };
  $scope.politeFormCanHelpChooseTexts = function() {
    return filteredTextListSvc.getTextCountForPropertyValue('PoliteForm','T') >= 2 && filteredTextListSvc.getTextCountForPropertyValue('PoliteForm','V') >= 2 ;
  };

  $scope.proximityCanHelpChooseTexts = function() {
    console.log(filteredTextListSvc.getTextCountForPropertyValue('Proximity','P') + ' === ' + filteredTextListSvc.getTextCountForPropertyValue('Proximity','D') );
    return filteredTextListSvc.getTextCountForPropertyValue('Proximity','P') >= 10 && filteredTextListSvc.getTextCountForPropertyValue('Proximity','D') >= 10;
  };


  $scope.canHaveSeveralRecipientsforCurrentArea = filtersSvc.canHaveSeveralRecipientsforCurrentArea;

  $scope.currentLanguageHasTVDistinction = function() {
    return currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode());
  };
}]);