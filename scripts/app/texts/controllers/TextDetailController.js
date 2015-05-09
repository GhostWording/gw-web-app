angular.module('app/texts/TextDetailController',[
                 'common/i18n',
                 'common/texts/alternativeTextList',
                 'common/services/facebookHelperSvc',
                 'common/services/postActionSvc'])

// Display text with alternative versions in other languages
.controller('TextDetailController',
['$scope','currentText', 'currentAreaName', 'currentIntentionSlugOrId','currentIntentionLabel','currentRecipientId','imageUrl','currentTextList',
          'tagLabelsSvc',  'alternativeTextsSvc','currentLanguage','helperSvc','$rootScope','$location','filtersSvc','facebookHelperSvc','postActionSvc','$modal','serverSvc','$http','currentUserLocalData','imagesSvc','ezfb',
function ($scope, currentText,  currentAreaName, currentIntentionSlugOrId,currentIntentionLabel, currentRecipientId, imageUrl,currentTextList,// those variables are resolved in routing.js
          tagLabelsSvc, alternativeTextsSvc,currentLanguage,helperSvc,$rootScope,$location,filtersSvc,facebookHelperSvc,postActionSvc, $modal,serverSvc,$http,currentUserLocalData,imagesSvc,ezfb) {

  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('Text',currentText.TextId,'TextDetail','Init');

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
  setMailTo($scope.txt.Content,imageUrl);


  var setCurrentImageForPage = function($scope,$rootScope,imgUrl) {
    $scope.imageUrl = imgUrl;
    $rootScope.ogImage = imgUrl;
    setMailTo($scope.txt.Content,imgUrl);
  };


  if ( !!imageUrl )
    setCurrentImageForPage ($scope,$rootScope,imageUrl);

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
      //console.log("URLA : " + imageUrl);
      //return serverSvc.getStaticResource(serverSvc.staticSiteQuery(currentRecipientId, currentIntentionSlugOrId), undefined,true)
      return serverSvc.getStaticResource(imageUrl, undefined,true)
        .then(function(imagePathWithSlash) {
        //console.log("imagePathWithSlash : " + imagePathWithSlash);

          // Get rid of first '/' if present
          var imageUrl = imagePathWithSlash.charAt(0) == '/' ? imagePathWithSlash.substr(1) : imagePathWithSlash;
          var dotIndex = imageUrl.lastIndexOf('.');
          var extNoDot = imageUrl.substring(dotIndex+1);
          var urlNoExtension = imageUrl.substring(0,dotIndex);

          //console.log("URLB : " + imageUrl);
          // Set url query parameters to new image path
          //$location.search('imageUrl',imageUrl);
          $location.search('imagePath',urlNoExtension);
          $location.search('imageExtension',extNoDot);

          // Build image url and set as current
          setCurrentImageForPage ($scope,$rootScope,serverSvc.makeImageUrlFromPath(imageUrl));
        }
      );

    }
  };

  setImageFromContext(currentRecipientId, currentIntentionSlugOrId,imageUrl);

  $scope.changeImage = function() {
    setImageFromContext(currentRecipientId, currentIntentionSlugOrId,undefined);
  };


  var fbUIShare = function (textToPost,imageUrl, pageUrl) {
    var textIsShort = textToPost.length <= 155;
    var postName = textIsShort ? textToPost : '. .'; // `-`
    var postDescription = textIsShort ? ':o)' : textToPost;
    ezfb.ui({
      method: 'feed',
      name: postName,
      picture: imageUrl,
      link: pageUrl,
      description: postDescription
    },
    function (res) {
      console.log("fb error : " + res);
    });
  };

  var fbUISend = function (pageUrl) {
    console.log($location.$$host+":"+$location.$$port);
    var hostwithport = $location.$$port ? $location.$$host+":"+$location.$$port : $location.$$host;
    //var urlToLinkTo = pageUrl.replace($location.$$host+":"+$location.$$port,"www.commentvousdire.com/webapp");
    var urlToLinkTo = pageUrl.replace(hostwithport,"www.commentvousdire.com/webapp");
    urlToLinkTo = urlToLinkTo.replace("imagePath=","imagePath=/");
    console.log(urlToLinkTo);
    ezfb.ui({
      method: 'send',
      link: urlToLinkTo
    },
    function (res) {
      console.log("fb error : " + res);
    });
  };


  $scope.fbShare = function () {
    //console.log("fbShare");
    fbUIShare(currentText.Content,$rootScope.ogImage, $location.absUrl());
  };

  $scope.fbSend = function () {
    fbUISend($location.absUrl());
  };

  $scope.userEmailIsEmpty = function() {
    var valret = true;
    if ( !!currentUserLocalData && !!(currentUserLocalData.email) && currentUserLocalData.email !== '')
      valret = false;
    return valret;
  };

  setMailTo($scope.txt.Content,imageUrl);


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


//  $scope.mail = function() {
//    // Problem : is not always ready on time
//    $translate($scope.theIntentionLabel).then(function(value) {
//      $scope.mailToThis = helperSvc.urlMailTo($scope.txt.Content + '%0D%0A' + '%0D%0A' + imageUrl, value);
//      return value;
//    });
//  };
  //$scope.mail();
  //$scope.mailToThis = helperSvc.urlMailTo($scope.txt.Content + '%0D%0A' + '%0D%0A' + imageUrl, $scope.theIntentionLabel);


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

