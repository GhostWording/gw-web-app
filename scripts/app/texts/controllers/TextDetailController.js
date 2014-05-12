angular.module('app/texts/TextDetailController', ['common/i18n'])

// Display text with author, link to the source, usage recommandations or comments

.controller('TextDetailController',
['$scope','currentText', 'currentIntention', 'currentArea', 'tagLabelsSvc', '$modal','currentRecipient', 'favouritesSvc','currentRecipientSvc','alternativeTextsSvc','availableLanguages','currentLanguage',
function ($scope, currentText, currentIntention, currentArea, tagLabelsSvc, $modal,currentRecipient, favouritesSvc,currentRecipientSvc,alternativeTextsSvc,availableLanguages,currentLanguage) {

  currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);
  $scope.currentArea = currentArea;
  $scope.currentIntention = currentIntention;
  $scope.currentText = currentText;

//  $scope.recipientId = currentRecipient ? currentRecipient.Id :  '';
  $scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);

  // Copy the text Content so that if we edit it we are not editing the original "text".
	// Probably some case of prototypal bizarrerie : modification to the text from the dialog are discarded if we dont use a proper object to carry the editableText property
  // $scope.editableText = currentText.Content;
  $scope.txt = {};
  $scope.txt.editableText = currentText.Content;

  $scope.send = function() {
    $scope.sendDialog = $modal.open({
      templateUrl: 'views/partials/sendTextForm.html',
      scope: $scope,
      controller: 'SendTextFormController',
      resolve: {
        currentText: function() { return currentText; }
      }
    });
  };

  $scope.editText = false;
  $scope.edit = function() {
    $scope.editText = true;
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
      var textGroups = alternativeTextsSvc.getAlternativeTexts(currentText,textList);

//      // TODO : for each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best one according to sender, recipient and polite form
    }
    else
      console.log("No alternative realization for " + currentText.TextId);

  });

}]);