angular.module('app/texts/TextAndImageController',[
  'common/i18n',
  'common/texts/alternativeTextList',
  'common/services/facebookHelperSvc',
  'common/services/postActionSvc'])

// Display text with alternative versions in other languages
.controller('TextAndImageController',
['$scope','currentText', 'currentAreaName', 'currentIntentionSlugOrId','currentIntentionLabel','currentRecipientId','imageUrl','imageName',
  'tagLabelsSvc',  'alternativeTextsSvc','currentLanguage','helperSvc','$rootScope','$location','filtersSvc','facebookHelperSvc','postActionSvc','$modal','serverSvc','$http','currentUserLocalData','imagesSvc','$translate',
  function ($scope, currentText,  currentAreaName, currentIntentionSlugOrId,currentIntentionLabel, currentRecipientId, imageUrl,imageName,// those variables are resolved in routing.js
            tagLabelsSvc, alternativeTextsSvc,currentLanguage,helperSvc,$rootScope,$location,filtersSvc,facebookHelperSvc,postActionSvc, $modal,serverSvc,$http,currentUserLocalData,imagesSvc,$translate) {

    // We want an Init event even if no action takes place, in case user lands here from Google or facebook
    postActionSvc.postActionInfo('Text',currentText.TextId,'TextDetail','Init');

    // Facebook tags
    // When may want to explicitly set og:title from here because facebook sometime picks the intention title instead
    //$rootScope.ogTitle = currentText.Content;

    console.log("==" + currentIntentionSlugOrId);
    if ( currentIntentionSlugOrId == "facebook-status" )
      $rootScope.ogDescription = currentText.Content;
    else
      $rootScope.ogDescription = currentIntentionLabel;

    // Copy the text Content so that if we edit it we are not editing the original "text".
    $scope.txt = {};
    // Content has to be property of a full object to avoid prototypal inheritance problems
    // adaptTextContentToLanguage will adapt quote formatting to text culture
    $scope.txt.Content = helperSvc.adaptTextContentToLanguage(currentText);


    function setMailTo(content,imgUrl) {
      $scope.mailToThis = helperSvc.urlMailTo(content + '%0D%0A' + '%0D%0A' + imgUrl, '');
    }


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
        //return serverSvc.getStaticResource(serverSvc.staticSiteQuery(currentRecipientId, currentIntentionSlugOrId), undefined,true)
        return serverSvc.getStaticResource(imageUrl, undefined,true)
        .then(function(imagePathWithSlash) {
          // Get rid of first '/' if present
          var imageUrl = imagePathWithSlash.charAt(0) == '/' ? imagePathWithSlash.substr(1) : imagePathWithSlash;
          var dotIndex = imageUrl.lastIndexOf('.');
          var extNoDot = imageUrl.substring(dotIndex+1);
          var urlNoExtension = imageUrl.substring(0,dotIndex);

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


  }]);

