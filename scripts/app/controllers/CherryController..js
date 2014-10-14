angular.module('app/controllers/CherryController', [])

.controller('CherryController', ['$scope',  'postActionSvc','$rootScope','$location','currentLanguage','appUrlSvc','intentionsSvc','appVersionCheck','textsSvc','$window', '$state','helperSvc','$translate','facebookSvc',
  function ($scope,postActionSvc,$rootScope,$location,currentLanguage,appUrlSvc,intentionsSvc,appVersionCheck,textsSvc,$window,$state,helperSvc,$translate,facebookSvc) {
    $scope.app = {};
    $scope.app.appUrlSvc = appUrlSvc;

    // Set title and description for meta tags and facebook tags
    $rootScope.pageTitle1 = "Comment vous dire. Les mots sur le bout de la langue, l'inspiration au bout des doigts";
    $rootScope.pageTitle2 = "";
    $rootScope.pageDescription = "Vos friends méritent de meilleurs messages";
    $rootScope.ogDescription = "Vos friends méritent de meilleurs messages";
    //$rootScope.ogTitle = $rootScope.pageTitle1;

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
      currentLanguage.setLanguageCode(langKey);
    };
    $scope.getLanguage = function() {
      return currentLanguage.getLanguageCode();
    };

    // Initialize spinner ojbect used to show that app is busy
    $scope.showSpinner = false;
    $scope.trackerIsActive = function () { return $rootScope.loadingTracker.active();};
    var skipTracker =  true;

    // Preload intentions
    intentionsSvc.getForArea('Friends',skipTracker);
    intentionsSvc.getForArea('LoveLife',skipTracker);
    intentionsSvc.getForArea('Family',skipTracker);
    intentionsSvc.getForArea('General',skipTracker);

    // Preload text lists
    textsSvc.getTextList('Friends', 'joyeux-anniversaire', currentLanguage.currentCulture(), skipTracker);
    textsSvc.getTextList('LoveLife', 'j-aimerais-vous-revoir', currentLanguage.currentCulture(),skipTracker);
    textsSvc.getTextList('LoveLife', 'je-pense-a-toi',currentLanguage.currentCulture(),skipTracker);
    textsSvc.getTextList('LoveLife', 'je-t-aime',currentLanguage.currentCulture(), skipTracker);
    textsSvc.getTextList('LoveLife', 'j-ai-envie-de-toi',currentLanguage.currentCulture(),skipTracker);

    // Display spinner when route change starts
    $rootScope.$on("$stateChangeStart",function (event, toState, toParams, fromState, fromParams) {
      $scope.showSpinner = true;
    });

    // When arriving on new page, set current title and description, set language from url, send pageview to ga, add language code to url if absent
    $rootScope.$on("$stateChangeSuccess",function (event, toState, toParams, fromState, fromParams) {
      // Stop showing spinner
      $scope.showSpinner = false;

      // Set facebook open graph og:url property
      $rootScope.ogUrl = $location.absUrl();

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

      // Set language form url if present
      var languageCode = toParams.languageCode;
      if ( languageCode &&  languageCode!== undefined) {
        currentLanguage.setLanguageCode(languageCode);
      }

      // Add language code to url if absent
      var includeLanguageInUrl = true;
      if (includeLanguageInUrl) {
        // Url states that we don't know the language code. Inject the current language code in the url instead of xx
        if (languageCode == 'xx') {
          currentLanguage.includeLanguageCodeInUrl(languageCode, currentLanguage.getLanguageCode());
        }
        // To be donne last : we like user urls to be prefixed by the language code in any cases
        if ( !languageCode )
          currentLanguage.insertCurrentLanguageCodeInUrlIfAbsent();
      }

    });
  }
]);