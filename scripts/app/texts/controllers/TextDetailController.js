angular.module('app/texts/TextDetailController', ['common/i18n'])

// Display text with author, link to the source, usage recommandations or comments

.controller('TextDetailController',
['$scope','currentText', 'currentIntention', 'currentArea', 'tagLabelsSvc', '$modal','currentRecipient', 'favouritesSvc','currentRecipientSvc','alternativeTextsSvc','availableLanguages','currentLanguage',
function ($scope, currentText, currentIntention, currentArea, tagLabelsSvc, $modal,currentRecipient, favouritesSvc,currentRecipientSvc,alternativeTextsSvc,availableLanguages,currentLanguage) {

  currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);
  $scope.currentArea = currentArea;
  $scope.currentIntention = currentIntention;
  $scope.currentText = currentText;

  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.txt = {};
  $scope.txt.Content = currentText.Content; // has to be property of a full object to avoid prototypal inheritance problems

  $scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);


  $scope.send = function() {
    $scope.sendDialog = $modal.open({
      templateUrl: 'views/partials/sendTextForm.html',
      scope: $scope,
      controller: 'SendTextFormController',
      resolve: {
//        currentText: function() { return $scope.currentText; }
        currentText: function() { return $scope.txt; }
      }
    });
  };

  $scope.editText = false;
  $scope.edit = function() {
    $scope.editText = true;
  };

  function insertAuthorInText(text,author) {
    var toBeAdded = " (" + author + ")";

    var pos = text.indexOf("»");
    var retval =  (pos > 0) ? text.substring(0, pos+1) + toBeAdded + text.substring(pos+1, text.length) : text +  toBeAdded;

    return retval;
  }

  $scope.addAuthor = function() {
//    var toBeAdded = " (" + currentText.Author + ")";
//    $scope.txt.Content += toBeAdded;
//    $scope.currentText.Content += toBeAdded;
    $scope.txt.Content = insertAuthorInText($scope.txt.Content, currentText.Author);
    //$scope.currentText.Content = insertAuthorInText($scope.currentText.Content, currentText.Author);
  };

  $scope.isFavourite = function() {
    return favouritesSvc.isExisting(currentText);
  };

  $scope.setFavourite = function() {
    favouritesSvc.setFavourite(currentText, currentArea, currentIntention, $scope.recipientId, $scope.isFavourite());
  };

//  alternativeTextsSvc.getRealizationList(currentArea.AreaId,currentText.TextId).then(function(textList) {
  alternativeTextsSvc.getRealizationList(currentArea.AreaId,currentText.PrototypeId).then(function(textList) {

    if ( textList != "null") {
      // For each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best ones according to sender, recipient and polite form
      var currentTextLanguageCode =   currentLanguage.getLanguageFromCulture(currentText.Culture);
      $scope.languageTextGroups = alternativeTextsSvc.getAlternativeTexts(currentText,textList,currentTextLanguageCode);
    }
    else
      console.log("No alternative realization for " + currentText.TextId);

  });

}]);