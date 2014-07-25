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
  'ngFacebook'
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
.config(['$facebookProvider', function( $facebookProvider ) {
  $facebookProvider.setAppId('582577148493403');
  $facebookProvider.setCustomInit({
    xfbml      : true,
    version    : 'v2.0'
  });
  // If we ever need to set different AppIds for TouchWording, MessagePanda, etc.
//  var fbAppId;
//  if ( /<your-reg-exp>/.test(window.location.hostname) ) {
//    fbAppId = '54345345345';
//  } else {
//    fbAppId = '345345546545';
//  }
//  $facebookProvider.setAppId(fbAppId);
}])
.controller('CherryController', ['$scope',  'PostActionSvc','$rootScope','$location','currentLanguage','appUrlSvc','intentionsSvc','appVersionCheck','textsSvc','$window', '$state','HelperSvc',
  function ($scope,PostActionSvc,$rootScope,$location,currentLanguage,appUrlSvc,intentionsSvc,appVersionCheck,textsSvc,$window,$state,HelperSvc) {
    $scope.app = {};
    $scope.app.appUrlSvc = appUrlSvc;
    $rootScope.pageTitle1 = "Comment vous dire. Les mots sur le bout de la langue, l'inspiration au bout des doigts";
    $rootScope.pageTitle2 = "";

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
      $scope.showSpinner = false;

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

      //console.log(textsSvc.getCurrentId());
      // First try to set the title according to current text
      if (!!textsSvc.getCurrentId()) {
        textsSvc.getCurrent().then(function (text) {
          if (text) {
            $rootScope.pageTitle1 = "";
            if ( HelperSvc.isQuote(text)) {
              var txt =  HelperSvc.replaceAngledQuotes(text.Content,"");
              $rootScope.pageTitle2 = HelperSvc.insertAuthorInText(txt, text.Author,true);
            }
            else
              $rootScope.pageTitle2 = text.Content;
            console.log("TITLE : " + $rootScope.pageTitle1 + " " + $rootScope.pageTitle2);
          }
          else
            getCurrentIntentionThenSetTitle();
        });
      }
      // else from current intention
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
  $rootScope.loadingTracker = promiseTracker({ activationDelay: 300, minDuration: 500 });
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
