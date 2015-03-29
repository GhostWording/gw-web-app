angular.module('app/texts/TextDetailController',[
                 'common/i18n',
                 'common/texts/alternativeTextList',
                 'common/services/facebookHelperSvc',
                 'common/services/postActionSvc'])

// Display text with alternative versions in other languages
.controller('TextDetailController',
['$scope','currentText', 'currentAreaName', 'currentIntentionSlugOrId','currentIntentionLabel','currentRecipientId',
          'tagLabelsSvc',  'alternativeTextsSvc','currentLanguage','helperSvc','$rootScope','$location','filtersSvc','facebookHelperSvc','postActionSvc','$modal','serverSvc','$http',
function ($scope, currentText,  currentAreaName, currentIntentionSlugOrId,currentIntentionLabel, currentRecipientId,// those variables are resolved in routing.js
          tagLabelsSvc, alternativeTextsSvc,currentLanguage,helperSvc,$rootScope,$location,filtersSvc,facebookHelperSvc,postActionSvc, $modal,serverSvc,$http) {

  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('Text',currentText.TextId,'TextDetail','Init');

  // Facebook tags
  // When may want to explicitly set og:title from here because facebook sometime picks the intention title instead
  //$rootScope.ogTitle = currentText.Content;
  $rootScope.ogDescription = currentIntentionLabel;

  // Add labels to router resolved currentText
  currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);

  // Give visibility
  $scope.theIntentionSlugOrId = currentIntentionSlugOrId;
  $scope.theIntentionLabel = currentIntentionLabel;

  $scope.includeSocialPluginsOnTextPages = facebookHelperSvc.includeSocialPluginsOnTextPages;
  $scope.url = $location.url();
  $scope.currentAreaName = currentAreaName;
  $scope.currentText = currentText;
  $scope.Id = currentText.TextId;
  $scope.authorButton = "active";

  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.txt = {};
  // Content has to be property of a full object to avoid prototypal inheritance problems
  // adaptTextContentToLanguage will adapt quote formatting to text culture
  $scope.txt.Content = helperSvc.adaptTextContentToLanguage(currentText);

  //$scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);
  $scope.recipientId = currentRecipientId;

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


  var getStatic = function(path, params, skipTracker, optionalCulture) {
    var culture = optionalCulture !== undefined ? optionalCulture : currentLanguage.currentCulture();
    return $http({
      method: 'GET',
      url : "http://" + path,
      headers: {
        'Accept-Language': culture,
        'Ghost-Language': culture,
        'Content-Type': 'application/json'
      },
      cache: false,
      params: params,
      // Not all http get activate the tracker (reporting users actions and pre-fetching data should not activate a spinner)
      tracker: skipTracker !== true ? $rootScope.loadingTracker : null
    }).then(
    function (response) {
      console.log('Request for "' + path + '" responded with ' + response.status + ' for culture ' + culture);
      return response.data;
    },
    function (error) {
      console.log("error");
      //return $q.reject(path + 'rejected in serverSvc : ');
    }

    );
  };

  var getImageForText = function() {
    //var retval = "http://gw-static.azurewebsites.net/cvd/sweetheart/stocklove/small/10624691_581498388628102_7259835679150402181_n.jpg";
    var requete = "gw-static.azurewebsites.net/container/randomfile/cvd?size=small";

    return getStatic(requete, undefined,true).then(function(response) {
      console.log(response);
      $scope.imagePath = "http://gw-static.azurewebsites.net" + response;
      return $scope.imagePath;
    });
  };

  getImageForText();
  //$scope.$digest();

  $scope.changeImage = function() {
//    $scope.$digest();
    getImageForText();
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

