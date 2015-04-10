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
//    status     : true,
//    xfbml      : true,
    version: 'v1.0'
  });
}])

//.run(['$rootScope', 'promiseTracker', function($rootScope,  promiseTracker) {
.run(['$rootScope', 'promiseTracker', function($rootScope,  promiseTracker) {
  // Promise tracker to display spinner when getting files
  $rootScope.loadingTracker = promiseTracker({ activationDelay: 300, minDuration: 400 });
}]);
