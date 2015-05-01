angular.module('app/controllers/CherryController', [])

.controller('CherryController', ['$scope',  'postActionSvc','$rootScope','$location','currentLanguage','appUrlSvc','intentionsSvc','appVersionCheck','textsSvc','$window', '$state','helperSvc','$translate','availableLanguages',
  function ($scope,postActionSvc,$rootScope,$location,currentLanguage,appUrlSvc,intentionsSvc,appVersionCheck,textsSvc,$window,$state,helperSvc,$translate,availableLanguages) {
    $scope.app = {};
    $scope.app.appUrlSvc = appUrlSvc;

    // Set title and description for meta tags and facebook tags
    $rootScope.pageTitle1 = "Comment vous dire. Les mots sur le bout de la langue, l'inspiration au bout des doigts";
    $rootScope.pageTitle2 = "";
    $rootScope.pageDescription = "Vos friends méritent de meilleurs messages";
    $rootScope.ogDescription = "Vos friends méritent de meilleurs messages";


    // Is that changes, the translations must change
    $rootScope.pageKeywords = "Statuts facebook amusants";
    //$rootScope.ogTitle = $rootScope.pageTitle1;

    $rootScope.ogImage = "http://www.commentvousdire.com/assets/TouchWording.jpg";

    console.log(navigator.userAgent);

    // Send initialization event to server
    postActionSvc.postInitInfo().then(function() {
      postActionSvc.postActionInfo('Init', 'Init', 'App', 'Init');
      // Do it again just for verification : we do loose some of them
      //postActionSvc.postInitInfo();
    });

    // Try to guess language from current url
    currentLanguage.setLanguageForHostName($location.$$host);

    $scope.changeLanguage = function (langKey) {
      currentLanguage.setLanguageCode(langKey,true);
    };
    $scope.getLanguage = function() {
      return currentLanguage.getLanguageCode();
    };

    // Initialize spinner ojbect used to show that app is busy
    $scope.showSpinner = false;
    $scope.trackerIsActive = function () { return $rootScope.loadingTracker.active();};
    var skipTracker =  true;

    // Inform prerender that the page is all set for prerendering
    $window.prerenderReady = true;

    // Preload intentions
    intentionsSvc.getIntentionsForArea('Friends',skipTracker);
    intentionsSvc.getIntentionsForArea('LoveLife',skipTracker);
    intentionsSvc.getIntentionsForArea('Family',skipTracker);
    intentionsSvc.getIntentionsForArea('General',skipTracker);

    // Preload text lists
    var makeShortVersionAndSort =  true;
    textsSvc.getTextList('Friends', 'joyeux-anniversaire', currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
    textsSvc.getTextList('LoveLife', 'j-aimerais-vous-revoir', currentLanguage.currentCulture(),skipTracker,makeShortVersionAndSort);
    textsSvc.getTextList('LoveLife', 'je-pense-a-toi',currentLanguage.currentCulture(),skipTracker,makeShortVersionAndSort);
    textsSvc.getTextList('LoveLife', 'je-t-aime',currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
    textsSvc.getTextList('LoveLife', 'j-ai-envie-de-toi',currentLanguage.currentCulture(),skipTracker,makeShortVersionAndSort);

    // Display spinner when route change starts
    $rootScope.$on("$stateChangeStart",function (event, toState, toParams, fromState, fromParams) {
      $scope.showSpinner = true;
    });

    // When arriving on new page, set current title and description, set language from url, send pageview to ga, add language code to url if absent
    $rootScope.$on("$stateChangeSuccess",function (event, toState, toParams, fromState, fromParams) {
      // Stop showing spinner
      $scope.showSpinner = false;


      var fullUrl = $location.absUrl();
      var urlNoExtension = fullUrl;
      var urlNoQueryParam = fullUrl;

      if ( fullUrl.match(/\.(jpg|jpeg|png|gif|JPG|JPEG)$/) )  {
        var dotIndex = fullUrl.lastIndexOf('.');
        var ext = fullUrl.substring(dotIndex);
        urlNoExtension = fullUrl.substring(0,dotIndex);
        console.log("OR : " + urlNoExtension );
      }
      var queryIndex = fullUrl.lastIndexOf('?');
      if ( queryIndex >= 0 ) {
        urlNoQueryParam = fullUrl.substring(0,queryIndex);
        console.log("NOPARAM : " + urlNoQueryParam );
      }

      // Set facebook open graph og:url property
      //$rootScope.ogUrl = urlNoExtension;
      $rootScope.ogUrl = urlNoQueryParam;


      //$rootScope.ogUrl = $location.absUrl();

//      console.log("URL : " + $rootScope.ogUrl);
//      console.log("OR : " + $location.host()+$location.path());
//      console.log("OR : " + pre + ' ' + ext );

      function chooseTitleFromIntentionOrSiteDefault(intention) {
        if (intention) {
          $rootScope.pageTitle1 = "Comment dire";
          $rootScope.pageTitle2 = intention.Label;
        }
        else {
          $rootScope.pageTitle1 = "Comment vous dire : les mots sur le bout de la langue, l'inspiration au bout des doigts";
          $rootScope.pageTitle2 = "";
        }
      }
      function getCurrentIntentionThenSetTitle() {
        intentionsSvc.getCurrent().then(function(intention) {
          chooseTitleFromIntentionOrSiteDefault(intention);
          console.log("TITLE : " + $rootScope.pageTitle1 + " " + $rootScope.pageTitle2);
        });
      }
      // Set title and description for facebook bot
      function setTitleFromCurrentText() {
        textsSvc.getCurrentText(currentLanguage.currentCulture()).then(function (text) {
          if (text) {
            $rootScope.pageTitle1 = "";
            if ( helperSvc.isQuote(text)) {
              var txt =  helperSvc.replaceAngledQuotes(text.Content,"");
              $rootScope.pageTitle2 = helperSvc.insertAuthorInText(txt, text.Author,true);
              $translate("Citation").then(function(value) {$rootScope.pageTitle2 += " - " + value;});
            }
            else
              $rootScope.pageTitle2 = text.Content;

            // Modify the page description as well : Comment dire + intention label => How to say + translated intention label
            intentionsSvc.getCurrent().then(function(intention) {
              if ( !intention ) {
                console.log("no intention defined");
                return;
              }
              $translate("Comment dire").then(function(translatedPrefix) {
                $translate(intention.Label).then(function(translatedIntentionLable) {
                  $rootScope.pageDescription = translatedPrefix + " " + helperSvc.lowerFirstLetter(translatedIntentionLable);
                  $rootScope.ogDescription = translatedIntentionLable;
                  console.log("ogDescription : " +$rootScope.ogDescription);
                });
              });
            });
          }
          else
            getCurrentIntentionThenSetTitle();
        });
      }

      // If current text is defined, set the title using to current text content
      if (!!textsSvc.getCurrentTextId())
        setTitleFromCurrentText();
      // else set the title using current intention label
      else
        getCurrentIntentionThenSetTitle();

      // Send event to google analytics
      if ( $window.ga ) {
        var path = $location.path();
        $window.ga('send', 'pageview', { page: path });
      }

      // Look for language changes in url
      var languageCodeFromParam = toParams.languageCode;

      // If there is xx in place of the language, replace it by current language
      if (languageCodeFromParam == 'xx') {
        currentLanguage.includeLanguageCodeInUrl(languageCodeFromParam, currentLanguage.getLanguageCode());
      }
      // else see if we need to update current language
      else {
        // the language code is set in the url
        if ( !!languageCodeFromParam  )  {
          // the language code in the url is valid and different from the current one
          if ( availableLanguages.languageCodeExists(languageCodeFromParam) &&  languageCodeFromParam != currentLanguage.getLanguageCode()) {
            currentLanguage.setLanguageCode(languageCodeFromParam,true);
          }
          // Language code defined in url but not valid, replace by current language
          if ( !availableLanguages.languageCodeExists(languageCodeFromParam) ) {
            currentLanguage.includeLanguageCodeInUrl(languageCodeFromParam, currentLanguage.getLanguageCode());
          }
        }
        // optional : insert current language if there is none in the url
        if ( !languageCodeFromParam )
          currentLanguage.insertCurrentLanguageCodeInUrlIfAbsent();
      }

    });
  }
]);