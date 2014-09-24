angular.module('app/texts/TextDetailController', ['common/i18n', 'app/texts/alternativeTextList','common/services/facebookHelperSvc','common/services/postActionSvc'])

// Display text with author, link to the source, usage recommandations or comments

.controller('TextDetailController',
['$scope','currentText', 'currentIntention',  'tagLabelsSvc', '$modal','currentRecipient', 'favouritesSvc','currentRecipientSvc','alternativeTextsSvc','currentLanguage','helperSvc','currentAreaName','$rootScope','$location','filtersSvc','facebookHelperSvc','postActionSvc',
function ($scope, currentText, currentIntention, tagLabelsSvc, $modal,currentRecipient, favouritesSvc,currentRecipientSvc,alternativeTextsSvc,currentLanguage,helperSvc,currentAreaName,$rootScope,$location,filtersSvc,facebookHelperSvc,postActionSvc) {
  // TODO : when may want to explicitly set og:title from here because facebook randomly picks the intention title instead

  $scope.includeSocialPluginsOnTextPages = facebookHelperSvc.includeSocialPluginsOnTextPages;

  $scope.url = $location.url();

  currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);
  $scope.currentAreaName = currentAreaName;
  $scope.currentIntention = currentIntention;
  $scope.currentText = currentText;


  if ( !! currentIntention )
    $rootScope.ogDescription = currentIntention.Label;
  else
    console.log("no current intention");
  //$rootScope.ogTitle = currentText.Content;

  $scope.Id = currentText.TextId;


  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('Text',currentText.TextId,'TextDetail','Init');


  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.txt = {};
  $scope.txt.Content = currentText.Content; // has to be property of a full object to avoid prototypal inheritance problems


  // TODO : move in helper
  function adaptTextContentToLanguage(text) {
    var valret = text.Content;
    if (helperSvc.isQuote(currentText)) {
      if (text.Culture != "fr-FR")
        valret = helperSvc.replaceAngledQuotes(text.Content, '"');
      else
        valret = helperSvc.insertSpaceInsideAngledQuotes(text.Content);
    }
    return valret;
  }
  $scope.txt.Content = adaptTextContentToLanguage(currentText);

  $scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);

  $scope.authorButton = "active";

  $scope.isQuote = function(txt) {
    return helperSvc.isQuote(txt);
  };

  $scope.send = function() {
    //postActionSvc.postActionInfo('Text',currentText.TextId, 'TexDetail','send');

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
    $scope.txt.Content = helperSvc.insertAuthorInText($scope.txt.Content, currentText.Author);
    $scope.authorButton = "disabled";
  };

  $scope.isFavourite = function() {
    return favouritesSvc.isExisting(currentText);
  };

  $scope.setFavourite = function() {
    if ( currentIntention )
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
      //console.log(t);
      t.Content = adaptTextContentToLanguage(t);
    }

    if ( textList != "null") {
      // For each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best ones according to sender, recipient and polite form
      var currentTextLanguageCode =   currentLanguage.getLanguageFromCulture(currentText.Culture);
      var currentFilters = filtersSvc.getCurrentFilters();
      $scope.languageTextGroups = alternativeTextsSvc.getAlternativeTexts(currentText,textList,currentTextLanguageCode,currentFilters);
    }
    else
      console.log("No alternative realization for " + currentText.TextId);
  });


}]);

// Make sure social buttons are displayed
//  $facebook.getLoginStatus().then(function(response) {
//    FB.XFBML.parse(); // fb sdk must be initialised before FB can be mentionned
//  } );

//  $scope.fbShare = function () {
//    var url = $location.absUrl();
////    console.log(url);
//    ezfb.ui(
//    {
//      method: 'feed',
//      name: $rootScope.pageTitle1 + " " + $rootScope.pageTitle2,
//      picture: 'http://www.commentvousdire.com/assets/TouchWordingCompressed.png',
//      link: url,
//      description: currentIntention.Label
//    },function (res) {});
//  };
//
//  $scope.fbSend = function () {
//    var url = $location.absUrl();
//    ezfb.ui({
//      method: 'send',
//      name: $rootScope.pageTitle1 + " " + $rootScope.pageTitle2,
//      picture: 'http://www.commentvousdire.com/assets/TouchWordingCompressed.png',
//      link: url,
//      description: currentIntention.Label
//    },function (res) { console.log(res);} );
//  };