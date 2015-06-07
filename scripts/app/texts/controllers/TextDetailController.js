angular.module('app/texts/TextDetailController',[
                 'common/i18n',
                 'common/texts/alternativeTextList',
                 'common/services/facebookHelperSvc',
                 'common/services/postActionSvc',
                 'common/services/stackedMap'])

// Display text with alternative versions in other languages
.controller('TextDetailController',
['$scope','currentText', 'currentAreaName', 'currentIntentionSlugOrId','currentIntentionLabel','currentRecipientId','imageUrl','currentTextList','initialCultureCode',
          'tagLabelsSvc',  'alternativeTextsSvc','currentLanguage','helperSvc','$rootScope','$location','filtersSvc','facebookHelperSvc','postActionSvc','$modal','serverSvc','$http','currentUserLocalData','imagesSvc','ezfb','$window','stackedMap','appUrlSvc','facebookSvc','weightedTextRandomPickSvc','textStackedMap',
function ($scope, currentText,  currentAreaName, currentIntentionSlugOrId,currentIntentionLabel, currentRecipientId, imageUrl,currentTextList,initialCultureCode,// those variables are resolved in routing.js
          tagLabelsSvc, alternativeTextsSvc,currentLanguage,helperSvc,$rootScope,$location,filtersSvc,facebookHelperSvc,postActionSvc, $modal,serverSvc,$http,currentUserLocalData,imagesSvc,ezfb,$window,stackedMap,appUrlSvc,facebookSvc,weightedTextRandomPickSvc,textStackedMap) {


// TODO : pick random text in same intention, check that not in stack, memorize in stack, replace text id with new id in url
//  var sampleText = weightedTextRandomPickSvc.pickOneTextFromTextList(currentTextList);
//  console.log(sampleText);

  $scope.screenWidth = function() {
    return $window.innerWidth;
  };

  if ( currentIntentionSlugOrId == "facebook-status" )
    $rootScope.ogDescription = currentText.Content;
  else
    $rootScope.ogDescription = currentIntentionLabel;

  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.txt = {};
  // Content has to be property of a full object to avoid prototypal inheritance problems
  $scope.txt.Content = helperSvc.adaptTextContentToLanguage(currentText); // adapts quote formatting

  function setMailTo(content,imgUrl) {
    var textToSend = content;
    if ( !!imageUrl )
      textToSend += '%0D%0A' + '%0D%0A' + imgUrl;
    $scope.mailToThis = helperSvc.urlMailTo(textToSend, '');
  }

  var setCurrentImageForPage = function($scope,$rootScope,imgUrl) {
    $scope.imageUrl = imgUrl;
    $rootScope.ogImage = imgUrl;
    setMailTo($scope.txt.Content,imgUrl);
  };

  if ( !!imageUrl )
    setCurrentImageForPage ($scope,$rootScope,imageUrl);

  $scope.getImageFileName = function() {
    if ( !$scope.imageUrl )
      return '';
    return appUrlSvc.getFileName($scope.imageUrl);
  };

  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('Text',currentText.TextId,'TextDetail','Init',$scope.getImageFileName());

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


  var setQueryParameters = function(imageUrl) {
    // Extract image name from url
    var imageName= appUrlSvc.getPathFromUrl(imageUrl);
    // Separate image file extension from image name
    var dotIndex = imageName.lastIndexOf('.');
    var extNoDot = imageName.substring(dotIndex+1);
    var urlNoExtension = imageName.substring(0,dotIndex);
    // Set url query parameters for image name and image file extension
    $location.search('imagePath',urlNoExtension);
    $location.search('imageExtension',extNoDot);
  };


  var firstDisplayOfPicture = true;
  var setImageFromContext = function(currentRecipientId, currentIntentionSlugOrId,requiredImageUrl) {
    // On first display, if the query parameter requires a specific image, this is what we want
    if ( !! requiredImageUrl && firstDisplayOfPicture ) {
      firstDisplayOfPicture = false;
      if (!($scope.imageUrl))
        setCurrentImageForPage ($scope,$rootScope,requiredImageUrl);
    } else {
      // else get one from the server
      var imageUrl = serverSvc.getStaticSiteRoot() + imagesSvc.staticSiteQuery(currentRecipientId, currentIntentionSlugOrId);
      return serverSvc.getStaticResource(imageUrl, undefined,true)
        .then(function(imagePathWithSlash) {
          // Get rid of first '/' if present
          var imageUrl = imagePathWithSlash.charAt(0) == '/' ? imagePathWithSlash.substr(1) : imagePathWithSlash;
          // Separate image path from image extension and set to parameters
          setQueryParameters (imageUrl);
          // Build image url and set as current
          setCurrentImageForPage ($scope,$rootScope,serverSvc.makeImageUrlFromPath(imageUrl));
        }
      );

    }
  };

  setImageFromContext(currentRecipientId, currentIntentionSlugOrId,imageUrl);

  var imageStack = stackedMap.createNew();

  $scope.previousImage = function() {
    var res = imageStack.top();
    if ( res ) {
      var imageUrl = res.value;
      console.log(res.value);
      imageStack.removeTop();
      // Separate image path from image extension
      setQueryParameters (imageUrl);
      // Build image url and set as current
      setCurrentImageForPage ($scope,$rootScope,imageUrl);
    }
  };

  $scope.changeImage = function() {
    imageStack.add($scope.imageUrl,$scope.imageUrl);
    console.log(imageStack.length() + " " + imageStack.top().value);
    setImageFromContext(currentRecipientId, currentIntentionSlugOrId,undefined);
  };

  $scope.noPreviousImage = function() {
    return (!imageStack || imageStack.length() === 0);
  };

//  var textStack = stackedMap.createNew();
  var textStack =  textStackedMap.get();


  var setNewText = function(newText,oldText) {
    if ( !!newText ) {
      $scope.currentText = newText;
      $scope.Id = newText.TextId;
      $scope.txt.Content = helperSvc.adaptTextContentToLanguage(newText);
      var oldUrl = $location.url();
      var newUrl = oldUrl.replace(oldText.TextId,newText.TextId);
      $location.url(newUrl);
    }
  };

  $scope.previousText = function() {
    var res = textStack.top();
    if ( res ) {
      var previousText = res.value;
      setNewText(previousText,$scope.currentText);
      //console.log(res.value);
      textStack.removeTop();
    }
  };

  var pickNewText = function(currentTextList, currentId, allReadTriedMap,maxNbTries ) {
    var choice;
    var nbTries = 0;
    do {
      choice = weightedTextRandomPickSvc.pickOneTextFromTextList(currentTextList);
      nbTries++;
    } while (nbTries <= maxNbTries && choice.Id != currentId && ! allReadTriedMap.get(choice.Id));
    return choice;
  };


  $scope.changeText = function() {
    //$scope.currentText
    textStack.add($scope.currentText.TextId,$scope.currentText);
    //console.log(textStack.length() + " " + textStack.top().value);

    // TODO : pick random text in same intention, check that not in stack, memorize in stack, replace text id with new id in url
    //var sampleText = weightedTextRandomPickSvc.pickOneTextFromTextList(currentTextList);
    var nextText = pickNewText (currentTextList, $scope.currentText.TextId, textStack,3 );
    if ( nextText )
      setNewText(nextText,$scope.currentText);
  };

  $scope.noPreviousText = function() {
    return (!textStack || textStack.length() === 0);
  };


  $scope.fbShare = function () {
//    console.log($rootScope.ogImage);
//    console.log($location.absUrl());
    facebookSvc.fbUIShare(currentText.Content,$rootScope.ogImage, $location.absUrl());
  };

  // Does not work well if facebook can access current page and finds something different
  // We could try to set og:url to alternative links ?
  $scope.fbSend = function () {
    var pageUrl = $location.absUrl();
    var hostwithport = $location.$$port ? $location.$$host+":"+$location.$$port : $location.$$host;
    var urlToLinkTo = pageUrl.replace(hostwithport,"www.commentvousdire.com/webapp");
    urlToLinkTo = urlToLinkTo.replace("imagePath=","imagePath=/");

    facebookSvc.fbUISend(urlToLinkTo);
  };

  $scope.userEmailIsEmpty = function() {
    var valret = true;
    if ( !!currentUserLocalData && !!(currentUserLocalData.email) && currentUserLocalData.email !== '')
      valret = false;
    return valret;
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

}]);


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

