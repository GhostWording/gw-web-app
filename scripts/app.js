// Angular 1.2.1
angular.module('cherryApp',  [
  'ngCookies',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap.modal',
  "ui.bootstrap.tpls",
  'common',
  'app',
  'angularSpinkit',
  'ajoslin.promise-tracker',
  'pascalprecht.translate'
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

.controller('CherryController', ['$scope',  'PostActionSvc','$rootScope','$location','currentLanguage','appUrlSvc','intentionsSvc','appVersionCheck','textsSvc','$window',
  function ($scope,PostActionSvc,$rootScope,$location,currentLanguage,appUrlSvc,intentionsSvc,appVersionCheck,textsSvc,$window) {
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

    // Preload a few things
    intentionsSvc.getForArea('Friends');
    intentionsSvc.getForArea('LoveLife');
    intentionsSvc.getForArea('Family');
    intentionsSvc.getForArea('General');

    textsSvc.getTextList('Friends', 'joyeux-anniversaire');
    textsSvc.getTextList('Friends', 'merci');
    textsSvc.getTextList('LoveLife', 'j-aimerais-vous-revoir');
    textsSvc.getTextList('LoveLife', 'je-pense-a-toi');
    textsSvc.getTextList('LoveLife', 'je-t-aime');
    textsSvc.getTextList('LoveLife', 'j-ai-envie-de-toi');
    textsSvc.getTextList('Family', 'je-pense-a-toi');

    // We may want to user a tracker linked to route change instead of directly setting
    $rootScope.$on("$stateChangeStart",function (event, toState, toParams, fromState, fromParams) {
//      console.log("$stateChangeStart");
//      console.log("FROM:", fromState, fromParams);
//      console.log("TO:", toState, toParams);
      $scope.showSpinner = true;
    });

    $rootScope.$on("$stateChangeSuccess",function (event, toState, toParams, fromState, fromParams) {
//      console.log("$stateChangeSuccess");
      $scope.showSpinner = false;

      intentionsSvc.getCurrent().then(function(intention) {
        if ( intention ) {
          $rootScope.pageTitle1 = "Comment dire";
          $rootScope.pageTitle2 = intention.Label;
        } else {
          $rootScope.pageTitle1 = "Comment vous dire : les mots sur le bout de la langue, l'inspiration au bout des doigts";
          $rootScope.pageTitle2 = "";
        }
      } );

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
  $rootScope.loadingTracker = promiseTracker({ activationDelay: 300, minDuration: 500 });
}]);
