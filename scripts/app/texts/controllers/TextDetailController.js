angular.module('app/texts/TextDetailController', ['common/i18n', 'app/texts/alternativeTextList'])

// Display text with author, link to the source, usage recommandations or comments

.controller('TextDetailController',
['$scope','currentText', 'currentIntention',  'tagLabelsSvc', '$modal','currentRecipient', 'favouritesSvc','currentRecipientSvc','alternativeTextsSvc','availableLanguages','currentLanguage','HelperSvc','currentAreaName',
function ($scope, currentText, currentIntention, tagLabelsSvc, $modal,currentRecipient, favouritesSvc,currentRecipientSvc,alternativeTextsSvc,availableLanguages,currentLanguage,HelperSvc,currentAreaName) {

  currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);
  //$scope.currentArea = currentArea;
  $scope.currentAreaName = currentAreaName;
  $scope.currentIntention = currentIntention;
  $scope.currentText = currentText;

  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.txt = {};
  $scope.txt.Content = currentText.Content; // has to be property of a full object to avoid prototypal inheritance problems

  $scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);

  $scope.authorButton = "active";

  $scope.isQuote = function(txt) {
    return HelperSvc.isQuote(txt);
  };

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
    var pos = text.indexOf("»");
    var spacing = (pos == text.length - 1 || pos < 0) ? "\n"
                                                      : ' ';
    var toBeAdded = spacing  + "(" + author + ")";
    var retval =  (pos > 0) ? text.substring(0, pos+1) + toBeAdded + text.substring(pos+1, text.length)
                            : text + toBeAdded;
    return retval;
  }

  $scope.addAuthor = function() {
//    var toBeAdded = " (" + currentText.Author + ")";
//    $scope.txt.Content += toBeAdded;
//    $scope.currentText.Content += toBeAdded;
    $scope.txt.Content = insertAuthorInText($scope.txt.Content, currentText.Author);
    $scope.authorButton = "disabled";
    //$scope.currentText.Content = insertAuthorInText($scope.currentText.Content, currentText.Author);
  };

  $scope.isFavourite = function() {
    return favouritesSvc.isExisting(currentText);
  };

  $scope.setFavourite = function() {
    favouritesSvc.setFavourite(currentText, currentAreaName, currentIntention, $scope.isFavourite());
  };

  // Compare text wi
//  $scope.getTVDistinction = function(text) {
//    return alternativeTextsSvc.getTVDistinction(currentText.Content,text);
//  };

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
//
//  Ecrit (par un homme) (à une femme) (en disant Tu)

//  alternativeTextsSvc.getRealizationList(currentArea.AreaId,currentText.TextId).then(function(textList) {
//  alternativeTextsSvc.getRealizationList(currentArea.AreaId,currentText.PrototypeId).then(function(textList) {
  alternativeTextsSvc.getRealizationList(currentAreaName,currentText.PrototypeId).then(function(textList) {

    if ( textList != "null") {
      // For each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best ones according to sender, recipient and polite form
      var currentTextLanguageCode =   currentLanguage.getLanguageFromCulture(currentText.Culture);
      $scope.languageTextGroups = alternativeTextsSvc.getAlternativeTexts(currentText,textList,currentTextLanguageCode);
    }
    else
      console.log("No alternative realization for " + currentText.TextId);
  });

}]);