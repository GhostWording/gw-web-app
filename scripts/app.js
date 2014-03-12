// Notre application
//var cherryApp = angular.module('cherryApp',  ['ui.bootstrap']);
//var cherryApp = angular.module('cherryApp',  ['ngCookies','ngSanitize']);
// Angular 1.2.1
angular.module('cherryApp',  [
  'ngCookies',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap.modal',
  "ui.bootstrap.tpls",
  'common',
  'app'
])


//CORS for angular v < 1.2
.config(['$httpProvider', '$locationProvider','$sceProvider', function ($httpProvider, $locationProvider,$sceProvider) {
  $locationProvider.html5Mode(true);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $sceProvider.enabled(false);
}])


//CORS for angular v > 1.2
.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(api\.)?cvd.io/]);
}])


.controller('NavBarController',  ['$scope',
  function ($scope) { }
])


.controller('FilterDialogController', ['$scope', function($scope) {

}])

.controller('SelectedTextController', ['$scope', function($scope) {

}])


.controller('CherryController', ['$scope', //'NormalTextFilters', 'PostActionSvc',
  function ($scope) {//, TextFilters, PostActionSvc, Tabs) {

    console.log(navigator.userAgent);

//    TextFilters.initializeFiltersToUndefined();

//    PostActionSvc.postActionInfo('Init', 'Init', 'App', 'Init');

    //Activate Bootstrap popover option
    $('#popoverCopier').popover({
      html: true,
      content: "Androïd : appuyer trois secondes sur le texte + icône sélection (T) + icône copier (feuilles)<br>iPhone : appuyer trois secondes sur le texte + relâcher + appuyer encore trois secondes + 'sélectionner tout' + 'copier'"
    });
  }
])

.run(['$rootScope', 'intentionsSvc', 'filtersSvc', function($rootScope, intentionsSvc, filtersSvc) {
  
  // Watch the current intention.  If it changes to something not null and different to what it
  // was before then reset the filters.
  var currentIntentionId = intentionsSvc.getCurrentId();
  $rootScope.$watch(
    function() { return intentionsSvc.getCurrentId(); },
    function(value) {
      if ( value && currentIntentionId !== value ) {
        currentIntentionId = value;
        filtersSvc.reset();
      }
    }
  );
}]);
