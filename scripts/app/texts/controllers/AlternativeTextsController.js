angular.module('app/texts/AlternativeTextsController', [])

.controller('AlternativeTextsController', ['$scope', 'helperSvc', 'alternativeTextsSvc','filtersSvc','currentLanguage',
  function($scope, helperSvc,alternativeTextsSvc,filtersSvc,currentLanguage) {

    // TRANSLATIONS
    $scope.getSenderGenderMessage = alternativeTextsSvc.getSenderGenderMessage;
    $scope.getRecipientGenderMessage = alternativeTextsSvc.getRecipientGenderMessage;
    $scope.getTVMessage = alternativeTextsSvc.getTVMessage;

    $scope.isVariationFormMorePrecise = function(text) {
      return alternativeTextsSvc.isVariationFormMorePrecise($scope.currentText,text);
    };

// For each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best ones according to sender, recipient and polite form
    alternativeTextsSvc.getRealizationList($scope.currentAreaName,$scope.currentText.PrototypeId).then(function(textList) {
      if ( !textList )
        return;
      // Adapt text Content formatting to culture
      for (var i = 0; i < textList.length; i++) {
        var t = textList[i];
        t.Content = helperSvc.adaptTextContentToLanguage(t);
      }
      // Make groups of best equivalents
      $scope.languageTextGroups = alternativeTextsSvc.getAlternativeTexts($scope.currentText,textList,currentLanguage.getLanguageFromCulture($scope.currentText.Culture),filtersSvc.getCurrentFilters());
    });

  }]);


