angular.module('app/texts/TextDetailController',[
                 'common/i18n',
                 'common/texts/alternativeTextList',
                 'common/services/facebookHelperSvc',
                 'common/services/postActionSvc',
                 'common/services/stackedMap'])

// Display text with alternative versions in other languages
.controller('TextDetailController',
['$scope','currentText', 'currentAreaName', 'currentIntentionSlugOrId','currentIntentionLabel','currentRecipientId','imageUrl','textListFilteredForRecipient','initialCultureCode',
          'alternativeTextsSvc','currentLanguage','helperSvc','$rootScope','$location','postActionSvc','serverSvc','currentUserLocalData','imagesSvc','ezfb','$window','stackedMap','appUrlSvc','facebookSvc','weightedTextRandomPickSvc','textStackedMap',
function ($scope, currentText,  currentAreaName, currentIntentionSlugOrId,currentIntentionLabel, currentRecipientId, initialImageUrl,textListFilteredForRecipient,initialCultureCode,// those variables are resolved in routing.js
          alternativeTextsSvc,currentLanguage,helperSvc,$rootScope,$location,postActionSvc, serverSvc,currentUserLocalData,imagesSvc,ezfb,$window,stackedMap,appUrlSvc,facebookSvc,weightedTextRandomPickSvc,textStackedMap) {

  $scope.getImageFileName = function() {
    return appUrlSvc.getFileName($scope.imageUrl);
  };
  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('Text',currentText.TextId,'TextDetail','Init',$scope.getImageFileName());

  // We use special formatting for xsmall screens such as iphone5
  $scope.screenWidth = function() { return $window.innerWidth; };
  // Special facebook property setting when displaying facebook status
  if ( currentIntentionSlugOrId == "facebook-status" )
    $rootScope.ogDescription = currentText.Content;
  else
    $rootScope.ogDescription = currentIntentionLabel;


  // txt.Content has to be property of a full object to avoid prototypal inheritance problems
  $scope.txt = {};

  // sets url mailto link. Does not react well when url changes
  function setMailTo(content,imgUrl) {
    var textToSend = content;
    if ( !!imgUrl )
      textToSend += '%0D%0A' + '%0D%0A' + imgUrl;
    $scope.mailToThis = helperSvc.urlMailTo(textToSend,'');
  }
  // Set a new text as current
  var setNewText = function(newText,oldText) {
    if ( !!newText ) {
      $scope.currentText = newText;
      // Adapts formatting of quotations. Copied so that modifying txt.Content does not impact original text
      $scope.txt.Content = helperSvc.adaptTextContentToLanguage(newText);
      // Refresh mailTo
      setMailTo($scope.txt.Content,$scope.imageUrl);
      // Change url to include new id
      if ( !! oldText)
        appUrlSvc.replaceTextIdInUrl(oldText.TextId,newText.TextId);
    }
  };
  setNewText(currentText,null);

  // Set a new image as current
  var setCurrentImageForPage = function(imgUrl) {
    $scope.imageUrl = imgUrl;
    $rootScope.ogImage = imgUrl;
    appUrlSvc.setQueryParameters(imgUrl);
    setMailTo($scope.txt.Content,$scope.imageUrl);
  };
  if ( !!initialImageUrl )
    setCurrentImageForPage (initialImageUrl);

  // Give scope visibility
  $scope.theIntentionSlugOrId = currentIntentionSlugOrId;
  $scope.theIntentionLabel = currentIntentionLabel;
  $scope.currentAreaName = currentAreaName;
  $scope.recipientId = currentRecipientId;
  $scope.isQuote = function(txt) { return helperSvc.isQuote(txt); };

  // Sets the initial image :
  var firstDisplayOfPicture = true;
  var setImageFromContext = function(currentRecipientId, currentIntentionSlugOrId,requiredImageUrl) {
    // On first display, if the query parameter requires a specific image, this is what we want
    if ( !! requiredImageUrl && firstDisplayOfPicture ) {
      firstDisplayOfPicture = false;
      if (!($scope.imageUrl))
        setCurrentImageForPage (requiredImageUrl);
    } else {
      // else get one from the server
      var imageUrl = serverSvc.getStaticSiteRoot() + imagesSvc.staticSiteQuery(currentRecipientId, currentIntentionSlugOrId);
      return serverSvc.getStaticResource(imageUrl, undefined,true)
        .then(function(imagePathWithSlash) {
          // Get rid of first '/' if present
          var imageUrl = imagePathWithSlash.charAt(0) == '/' ? imagePathWithSlash.substr(1) : imagePathWithSlash;
          // Build image url and set as current
          setCurrentImageForPage (serverSvc.makeImageUrlFromPath(imageUrl));
        }
      );
    }
  };

  setImageFromContext(currentRecipientId, currentIntentionSlugOrId,initialImageUrl);

  // IMAGE STACK
  var imageStack = stackedMap.createNew();
  $scope.previousImage = function() {
    var res = imageStack.top();
    if ( res ) {
      // Get image from top of stack
      var imageUrl = res.value;
      imageStack.removeTop();
      // Set as current
      setCurrentImageForPage (imageUrl);
    }
  };
  $scope.changeImage = function() {
    imageStack.add($scope.imageUrl,$scope.imageUrl);
    setImageFromContext(currentRecipientId, currentIntentionSlugOrId,undefined);
  };
  $scope.noPreviousImage = function() {
    return (!imageStack || imageStack.length() === 0);
  };

  // TEXT STACK
  var textStack =  textStackedMap.get();
  // Move back to previous text
  $scope.previousText = function() {
    var res = textStack.top();
    if ( res ) {
      var previousText = res.value;
      setNewText(previousText,$scope.currentText);
      textStack.removeTop();
    }
  };
  $scope.changeText = function() {
    // Memorize current in stack
    textStack.add($scope.currentText.TextId,$scope.currentText);
    // Choose text in current text that is not current one or from previous choices
    var nextText = weightedTextRandomPickSvc.pickNewTextDifferentThan (textListFilteredForRecipient, $scope.currentText.TextId, textStack,3 );
    // replace text id with new id in url
    if ( nextText )
      setNewText(nextText,$scope.currentText);
  };
  $scope.noPreviousText = function() {
    return (!textStack || textStack.length() === 0);
  };

  // FACEBOOK  Share and Send
  $scope.fbShare = function () {
    facebookSvc.fbUIShare(currentText.Content,$rootScope.ogImage, $location.absUrl());
  };
  // Does not work so well if facebook accesses current page and finds something different, could try to sec og.Link as well
  $scope.fbSend = function () {
    facebookSvc.fbUISend(appUrlSvc.makeStaticFbSendWebAppUrlFromCurrentUrl());
  };

  $scope.userEmailIsEmpty = function() {
    var valret = true;
    if ( !!currentUserLocalData && !!(currentUserLocalData.email) && currentUserLocalData.email !== '')
      valret = false;
    return valret;
  };

  // EDIT TEXT (not currently used)
  $scope.editText = false;
  $scope.edit = function() {
    $scope.editText = true;
  };
  // ADD AUTHOR  (not currently used)
  $scope.authorButton = "active";
  $scope.addAuthor = function() {
    $scope.txt.Content = helperSvc.insertAuthorInText($scope.txt.Content, currentText.Author);
    $scope.authorButton = "disabled";
  };


  // TRANSLATIONS
  var showTranslations = false;
  if ( $scope.currentText.Culture != currentLanguage.getCultureCode() ) {
    showTranslations = true;
  }
  $scope.setShowTranslations = function(val) {
    showTranslations = val;
  };
  $scope.getShowTranslations = function() {
    return showTranslations;
  };
//  $scope.HasTranslations = true;
//  // Should be set in a property of the text instead
//  alternativeTextsSvc.getRealizationList($scope.currentAreaName,$scope.currentText.PrototypeId).then(function(textList) {
//    if ( !textList || textList.length < 2 )
//      $scope.HasTranslations = false;
//  });
  // New : OtherRealizationIds is now available in all cases
  $scope.HasTranslations = $scope.currentText.OtherRealizationIds &&
                           $scope.currentText.OtherRealizationIds.length > 0 &&
                           $scope.currentText.OtherRealizationIds[0].length > 0;


}]);

//$scope.includeSocialPluginsOnTextPages = facebookHelperSvc.includeSocialPluginsOnTextPages;


// Add labels to router resolved currentText
// currentText.TagLabels = tagLabelsSvc.labelsFromStyleTagIds(currentText.TagIds);


// Popup send window
//$scope.send = function() {
//  $scope.sendDialog = $modal.open({
//    templateUrl: 'views/partials/sendTextForm.html',
//    scope: $scope,
//    controller: 'SendTextFormController',
//    resolve: {
//      currentText: function() { return $scope.txt; }
//    }
//  });
//};

//  $scope.mail = function() {
//    // Problem : is not always ready on time
//    $translate($scope.theIntentionLabel).then(function(value) {
//      $scope.mailToThis = helperSvc.urlMailTo($scope.txt.Content + '%0D%0A' + '%0D%0A' + imageUrl, value);
//      return value;
//    });
//  };
//$scope.mail();
//$scope.mailToThis = helperSvc.urlMailTo($scope.txt.Content + '%0D%0A' + '%0D%0A' + imageUrl, $scope.theIntentionLabel);


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

