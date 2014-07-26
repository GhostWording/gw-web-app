// Angular 1.2.1
angular.module('cherryApp',  [
  'ngCookies',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap.modal',
  "ui.bootstrap.tpls",
  "ui.bootstrap.accordion",
  'common',
  'app',
  'angularSpinkit',
  'ajoslin.promise-tracker',
  'pascalprecht.translate',
//'ngFacebook'
  'ezfb'
])

//CORS for angular v < 1.2
.config(['$httpProvider', '$locationProvider','$sceProvider', function ($httpProvider, $locationProvider,$sceProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $sceProvider.enabled(false);
}])
//CORS for angular v > 1.2
.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(api\.)?cvd.io/]);
}])
//Facebook connexion configuration
// If we ever need to set different AppIds for TouchWording, MessagePanda, etc.
//  if ( /<your-reg-exp>/.test(window.location.hostname) ) fbAppId = '......';

//.config(['$facebookProvider', function( $facebookProvider ) {
//  $facebookProvider.setAppId('582577148493403');
//  $facebookProvider.setCustomInit({
//    xfbml      : true,
//    version    : 'v2.0'
//  });
//}])
// TODO : configure best language
//.config(function (ezfbProvider) {
//  ezfbProvider.setLocale('fr_FR');
//})
.config(['ezfbProvider',function (ezfbProvider) {
  ezfbProvider.setInitParams({
    // https://developers.facebook.com/docs/javascript/reference/FB.init/v2.0
    appId: '582577148493403',
    status     : true,
    xfbml      : true,
    version: 'v2.0'
  });
}])
.controller('CherryController', ['$scope',  'PostActionSvc','$rootScope','$location','currentLanguage','appUrlSvc','intentionsSvc','appVersionCheck','textsSvc','$window', '$state','HelperSvc','$translate','myfb',
  function ($scope,PostActionSvc,$rootScope,$location,currentLanguage,appUrlSvc,intentionsSvc,appVersionCheck,textsSvc,$window,$state,HelperSvc,$translate,myfb) {
    $scope.app = {};
    $scope.app.appUrlSvc = appUrlSvc;
    $rootScope.pageTitle1 = "Comment vous dire. Les mots sur le bout de la langue, l'inspiration au bout des doigts";
    $rootScope.pageTitle2 = "";

    $rootScope.pageDescription = "Vos friends meritent de meilleurs messages";
    $rootScope.ogDescription = "Vos friends meritent de meilleurs messages";

    console.log(navigator.userAgent);
    currentLanguage.setLanguageForHostName($location.$$host);

    $scope.changeLanguage = function (langKey) {
      currentLanguage.setLanguageCode(langKey);
    };

    $scope.getLanguage = function() {
      return currentLanguage.getLanguageCode();
    };

    PostActionSvc.postActionInfo('Init', 'Init', 'App', 'Init');
    $scope.showSpinner = false;
    $scope.trackerIsActive = function () { return $rootScope.loadingTracker.active();};


    var skipTracker =  true;
    // Preload a few things
    intentionsSvc.getForArea('Friends',skipTracker);
    intentionsSvc.getForArea('LoveLife',skipTracker);
    intentionsSvc.getForArea('Family',skipTracker);
    intentionsSvc.getForArea('General',skipTracker);

    textsSvc.getTextList('Friends', 'joyeux-anniversaire',skipTracker);
    //textsSvc.getTextList('Friends', 'merci',skipTracker);
    textsSvc.getTextList('LoveLife', 'j-aimerais-vous-revoir',skipTracker);
    textsSvc.getTextList('LoveLife', 'je-pense-a-toi',skipTracker);
    textsSvc.getTextList('LoveLife', 'je-t-aime',skipTracker);
    textsSvc.getTextList('LoveLife', 'j-ai-envie-de-toi',skipTracker);
    //textsSvc.getTextList('Family', 'je-pense-a-toi',skipTracker);

    // We may want to user a tracker linked to route change instead of directly setting
    $rootScope.$on("$stateChangeStart",function (event, toState, toParams, fromState, fromParams) {
//      console.log("$stateChangeStart");
//      console.log("FROM:", fromState, fromParams);
//      console.log("TO:", toState, toParams);
      $scope.showSpinner = true;
    });

    $rootScope.$on("$stateChangeSuccess",function (event, toState, toParams, fromState, fromParams) {
      // Stop showing spinner
      $scope.showSpinner = false;

      // Set facebook open graph og:url property
      $rootScope.ogUrl = $location.absUrl();
      //console.log($rootScope.ogUrl);


//      $facebook.getLoginStatus().then(function (response) {
//        FB.XFBML.parse(); // fb sdk must be initialised before FB can be mentionned
//      });


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
      function setTitleFromCurrentText() {
        textsSvc.getCurrent().then(function (text) {
          if (text) {
            $rootScope.pageTitle1 = "";
            if ( HelperSvc.isQuote(text)) {
              var txt =  HelperSvc.replaceAngledQuotes(text.Content,"");
              $rootScope.pageTitle2 = HelperSvc.insertAuthorInText(txt, text.Author,true);
              $translate("Citation").then(function(value) {$rootScope.pageTitle2 += " - " + value;});
            }
            else
              $rootScope.pageTitle2 = text.Content;

            // Modify the page description as well : Comment dire + intention label => How to say + translated intention label
            intentionsSvc.getCurrent().then(function(intention) {
              $translate("Comment dire").then(function(translatedPrefix) {
                $translate(intention.Label).then(function(translatedIntentionLable) {
                  $rootScope.pageDescription = translatedPrefix + " " + HelperSvc.lowerFirstLetter(translatedIntentionLable);
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
      if (!!textsSvc.getCurrentId())
        setTitleFromCurrentText();
      // else set the title using current intention label
      else
        getCurrentIntentionThenSetTitle();

      var languageCode = toParams.languageCode;
      if ( languageCode &&  languageCode!== undefined) {
        currentLanguage.setLanguageCode(languageCode);
      }

      if ( $window.ga ) {
        var path = $location.path();
        $window.ga('send', 'pageview', { page: path });
      }

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
])

.controller('NavBarController',  ['$scope','appUrlSvc','currentLanguage','favouritesSvc', function($scope,appUrlSvc,currentLanguage,favouritesSvc) {
  if ( !$scope.app) {
    $scope.app = {};
    $scope.app.appUrlSvc = appUrlSvc;
  }

  $scope.changeLanguage = function (langKey) {
    currentLanguage.setLanguageCode(langKey);
  };

  $scope.getLanguage = function() {
    var l =currentLanguage.getLanguageCode();
    return currentLanguage.getLanguageCode();
  };

  $scope.hasFavourite = function()  {
    return favouritesSvc.hasFavourite();
  };
}])

.controller('FilterDialogController', ['$scope', function($scope) {
}])

.controller('SelectedTextController', ['$scope', function($scope) {
}])

.controller('LanguageBarController', ['$scope', function ($scope) {
}])

.run(['$rootScope', 'intentionsSvc', 'filtersSvc','promiseTracker', function($rootScope, intentionsSvc, filtersSvc,promiseTracker) {
  // Promise tracker to display spinner when getting files
  $rootScope.loadingTracker = promiseTracker({ activationDelay: 300, minDuration: 400 });
  // ngFacebook : Load the facebook SDK asynchronously
//  (function(){
//    // If we've already installed the SDK, we're done
//    if (document.getElementById('facebook-jssdk')) {return;}
//    // Get the first script element, which we'll use to find the parent node
//    var firstScriptElement = document.getElementsByTagName('script')[0];
//    // Create a new script element and set its id
//    var facebookJS = document.createElement('script');
//    facebookJS.id = 'facebook-jssdk';
//    // Set the new script's source to the source of the Facebook JS SDK
//    facebookJS.src = '//connect.facebook.net/en_US/all.js';
//    // Insert the Facebook JS SDK into the DOM
//    firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
//  }());
}]);
