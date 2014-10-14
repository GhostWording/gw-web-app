angular.module('app/texts/TextDetailController',[
                 'common/i18n',
                 'common/texts/alternativeTextList',
                 'common/services/facebookHelperSvc',
                 'common/services/postActionSvc'])

// Display text with alternative versions in other languages
.controller('TextDetailController',
['$scope','currentText', 'currentIntention','currentRecipient', 'currentAreaName',  'tagLabelsSvc',  'currentRecipientSvc','alternativeTextsSvc','currentLanguage','helperSvc','$rootScope','$location','filtersSvc','facebookHelperSvc','postActionSvc','$modal',
function ($scope, currentText, currentIntention,currentRecipient, currentAreaName, tagLabelsSvc, currentRecipientSvc,alternativeTextsSvc,currentLanguage,helperSvc,$rootScope,$location,filtersSvc,facebookHelperSvc,postActionSvc, $modal) {

  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('Text',currentText.TextId,'TextDetail','Init');

  // Facebook tags
  // When may want to explicitly set og:title from here because facebook sometime picks the intention title instead
  //$rootScope.ogTitle = currentText.Content;
  if ( !! currentIntention )
    $rootScope.ogDescription = currentIntention.Label;

  // Add labels to router resolved currentText
  currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);

  // Give visibility
  $scope.includeSocialPluginsOnTextPages = facebookHelperSvc.includeSocialPluginsOnTextPages;
  $scope.url = $location.url();
  $scope.currentAreaName = currentAreaName;
  $scope.currentIntention = currentIntention;
  $scope.currentText = currentText;
  $scope.Id = currentText.TextId;
  $scope.authorButton = "active";

  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.txt = {};
  // Content has to be property of a full object to avoid prototypal inheritance problems
  // adaptTextContentToLanguage will adapt quote formatting to text culture
  $scope.txt.Content = helperSvc.adaptTextContentToLanguage(currentText);

  $scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);
  $scope.isQuote = function(txt) { return helperSvc.isQuote(txt); };

  // Allows user to edit text content in an alternative controll
  $scope.editText = false;
  $scope.edit = function() {
    $scope.editText = true;
  };
  // When text is quotation, insert author name after the closing quotation mark
  $scope.addAuthor = function() {
    $scope.txt.Content = helperSvc.insertAuthorInText($scope.txt.Content, currentText.Author);
    $scope.authorButton = "disabled";
  };

  $scope.getSenderGenderMessage = alternativeTextsSvc.getSenderGenderMessage;
  $scope.getRecipientGenderMessage = alternativeTextsSvc.getRecipientGenderMessage;
  $scope.getTVMessage = alternativeTextsSvc.getTVMessage;

  $scope.isVariationFormMorePrecise = function(text) {
    return alternativeTextsSvc.isVariationFormMorePrecise(currentText,text);
  };

  // For each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best ones according to sender, recipient and polite form
  alternativeTextsSvc.getRealizationList(currentAreaName,currentText.PrototypeId).then(function(textList) {
    if ( !textList )
      return;
    // Adapt text Content formating to culture
    for (var i = 0; i < textList.length; i++) {
      var t = textList[i];
      t.Content = helperSvc.adaptTextContentToLanguage(t);
    }
    // Make groups of best equivalents
    $scope.languageTextGroups = alternativeTextsSvc.getAlternativeTexts(currentText,textList,currentLanguage.getLanguageFromCulture(currentText.Culture),filtersSvc.getCurrentFilters());
  });

  $scope.send = function() {
    //postActionSvc.postActionInfo('Text',currentText.TextId, 'TexDetail','send');
    $scope.sendDialog = $modal.open({
      templateUrl: 'views/partials/sendTextForm.html',
      scope: $scope,
      controller: 'SendTextFormController',
      resolve: {
        currentText: function() { return $scope.txt; }
      }
    });
  };

}]);

// Returns a message when text alternative is written for recipient with a different gender
//  $scope.getVariationWarning = function (text) {
//    var recipientWarning =  alternativeTextsSvc.getRecipientGenderVariationFromOriginal(currentText.Content,text);
//    var valret = "Ecrit par " + alternativeTextsSvc.getGenderString(text.Sender);
//    if ( recipientWarning !== "" )
//      valret += " " + recipientWarning;
//    return valret;
//  };

// Sender gender of this text, if defined
//$scope.getSenderGenderVariationFromCurrentUser = function (text) {
//  return alternativeTextsSvc.getSenderGenderVariationFromCurrentUser(text);
//};


//  $scope.isFavourite = function() {
//    return favouritesSvc.isExisting(currentText);
//  };
//  $scope.setFavourite = function() {
//    if ( currentIntention )
//      favouritesSvc.setFavourite(currentText, currentAreaName, currentIntention, $scope.isFavourite());
//  };

