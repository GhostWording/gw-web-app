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
  'ezfb' //'ngFacebook' did not work so well
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
// TODO : configure best language
.config(['ezfbProvider',function (ezfbProvider) {
  //ezfbProvider.setLocale('fr_FR');
}])
.config(['ezfbProvider',function (ezfbProvider) {
  ezfbProvider.setInitParams({
    appId: '582577148493403', // ou 582577148493403 ou 679461192138331 pour test

    // If you set status to true in the FB.init() call, the SDK will attempt to get info about the current user immediately after init.
    // Doing this can reduce the time it takes to check for the state of a logged in user if you're using Facebook Login,
    // but isn't useful for pages that only have social plugins on them.
    //status     : true,
    // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML.
    // If you're not using social plugins on the page, setting xfbml to false will improve page load times.
      xfbml      : true,
    //version: 'v1.0'
    version: 'v2.3'
  });
}])

//.run(['$rootScope', 'promiseTracker', function($rootScope,  promiseTracker) {
.run(['$rootScope', 'promiseTracker', function($rootScope,  promiseTracker) {
  // Promise tracker to display spinner when getting files
  $rootScope.loadingTracker = promiseTracker({ activationDelay: 300, minDuration: 400 });
}]);
