// Angular 1.2.1
angular.module('cherryApp',  [
  'ngCookies',
  'ngSanitize',
  'ngRoute',
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

//.config(function($translateProvider) {
//  $translateProvider
//  .translations('fr', {
//    HEADLINE: 'Ma super App!',
//    'A propos': 'A propos'
//  })
//  .translations('en', {
//    HEADLINE: 'Hello there, This is my awesome app!',
//    'A propos': 'About'
//  });
//  $translateProvider.preferredLanguage('en');
//})

.controller('NavBarController',  ['$scope','appUrlSvc','currentLanguage','favouritesSvc', function($scope,appUrlSvc,currentLanguage,favouritesSvc) {
  $scope.appUrlSvc = appUrlSvc;

  $scope.changeLanguage = function (langKey) {
    currentLanguage.setLanguageCode(langKey);
  };

  $scope.getLanguage = function() {
    var l =currentLanguage.getLanguageCode();
//    console.log(l);
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

.controller('CherryController', ['$scope',  'PostActionSvc','$rootScope','$location','currentLanguage',
  function ($scope,PostActionSvc,$rootScope,$location,currentLanguage) {
    console.log(navigator.userAgent);
    //console.log($location.$$host);
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

    // We may want to user a tracker linked to route change instead of directly setting
    $rootScope.$on("$routeChangeStart",function (event, current, previous, rejection) {
      $scope.showSpinner = true;
    });
    $rootScope.$on("$routeChangeSuccess",function (event, current, previous, rejection) {
      $scope.showSpinner = false;
      var languageCode = current.params.languageCode;
      if ( languageCode &&  languageCode!== undefined) {
//        console.log(languageCode);
        currentLanguage.setLanguageCode(languageCode);
      }
    });
  }
])

.run(['$rootScope', 'intentionsSvc', 'filtersSvc','promiseTracker', function($rootScope, intentionsSvc, filtersSvc,promiseTracker) {
  $rootScope.loadingTracker = promiseTracker({ activationDelay: 300, minDuration: 500 });
}]);
