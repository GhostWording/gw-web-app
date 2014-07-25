angular.module('app/texts/TextDetailController', ['common/i18n', 'app/texts/alternativeTextList'])

// Display text with author, link to the source, usage recommandations or comments

.controller('TextDetailController',
['$scope','currentText', 'currentIntention',  'tagLabelsSvc', '$modal','currentRecipient', 'favouritesSvc','currentRecipientSvc','alternativeTextsSvc','currentLanguage','HelperSvc','currentAreaName',
function ($scope, currentText, currentIntention, tagLabelsSvc, $modal,currentRecipient, favouritesSvc,currentRecipientSvc,alternativeTextsSvc,currentLanguage,HelperSvc,currentAreaName) {

  currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);
  //$scope.currentArea = currentArea;
  $scope.currentAreaName = currentAreaName;
  $scope.currentIntention = currentIntention;
  $scope.currentText = currentText;

  $scope.Id = currentText.TextId;

  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.txt = {};
  $scope.txt.Content = currentText.Content; // has to be property of a full object to avoid prototypal inheritance problems

  function adaptTextContentToLanguage(text) {
    var valret = text.Content;
    if (HelperSvc.isQuote(currentText)) {
      if (text.Culture != "fr-FR")
        valret = HelperSvc.replaceAngledQuotes(text.Content, '"');
      else
        valret = HelperSvc.insertSpaceInsideAngledQuotes(text.Content);
    }
    console.log(valret);
    return valret;
  }

//  if (HelperSvc.isQuote(currentText)) {
//    if (currentText.Culture != "fr-FR")
//      $scope.txt.Content = HelperSvc.replaceAngledQuotes($scope.txt.Content, '"');
//    else
//      $scope.txt.Content = HelperSvc.insertSpaceInsideAngledQuotes($scope.txt.Content);
//  }
  $scope.txt.Content = adaptTextContentToLanguage(currentText);

  $scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);

  $scope.authorButton = "active";

  $scope.isQuote = function(txt) {
    return HelperSvc.isQuote(txt);
  };

  $scope.send = function() {
    //PostActionSvc.postActionInfo('Text',currentText.TextId, 'TexDetail','send');

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

  $scope.addAuthor = function() {
//    var toBeAdded = " (" + currentText.Author + ")";
//    $scope.txt.Content += toBeAdded;
//    $scope.currentText.Content += toBeAdded;
    $scope.txt.Content = HelperSvc.insertAuthorInText($scope.txt.Content, currentText.Author);
    $scope.authorButton = "disabled";
  };

  $scope.isFavourite = function() {
    return favouritesSvc.isExisting(currentText);
  };

  $scope.setFavourite = function() {
    favouritesSvc.setFavourite(currentText, currentAreaName, currentIntention, $scope.isFavourite());
  };

  $scope.getSenderGenderVariationFromCurrentUser = function (text) {
    return alternativeTextsSvc.getSenderGenderVariationFromCurrentUser(text);
  };
  $scope.getVariationWarning = function (text) {
    var recipientWarning =  alternativeTextsSvc.getRecipientGenderVariationFromOriginal(currentText.Content,text);

    var valret = "Ecrit par " + alternativeTextsSvc.getGenderString(text.Sender);
    if ( recipientWarning !== "" )
      valret += " " + recipientWarning;
    return valret;
  };
  $scope.getSenderGender = function(text) {
    return "par " + text.Sender;
  };
  $scope.getRecipientGender = function(text) {
    return "à " + text.Target;
  };
  $scope.getTV = function(text) {
    return "en disant " + text.PoliteForm;
  };

  $scope.isVariationFormMorePrecise = function(text) {
    return alternativeTextsSvc.isVariationFormMorePrecise(currentText,text);
  };

  alternativeTextsSvc.getRealizationList(currentAreaName,currentText.PrototypeId).then(function(textList) {

    // Adapt text Content formating to culture
    for (var i = 0; i < textList.length; i++) {
      var t = textList[i];
      console.log(t);
      t.Content = adaptTextContentToLanguage(t);
    }

    if ( textList != "null") {
      // For each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best ones according to sender, recipient and polite form
      var currentTextLanguageCode =   currentLanguage.getLanguageFromCulture(currentText.Culture);
      $scope.languageTextGroups = alternativeTextsSvc.getAlternativeTexts(currentText,textList,currentTextLanguageCode);
    }
    else
      console.log("No alternative realization for " + currentText.TextId);
  });

}]);