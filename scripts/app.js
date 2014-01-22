// Notre application
//var cherryApp = angular.module('cherryApp',  ['ui.bootstrap']);
//var cherryApp = angular.module('cherryApp',  ['ngCookies','ngSanitize']);
// Angular 1.2.1
var cherryApp = angular.module('cherryApp',  ['ngCookies','ngSanitize','ngRoute']);



//CORS for angular v < 1.2
cherryApp.config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
//CORS for angular v > 1.2
cherryApp.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(api\.)?cvd.io/]);
}]);


cherryApp.controller('NavBarController',  ['$scope', 'PostActionSvc',
    function ($scope, PostActionSvc) {
        $scope.PostBox = PostActionSvc;

    }
]);


cherryApp.controller('CherryControler', ['$scope', '$cookies','NormalTextFilters','PostActionSvc',
   function ($scope, $cookies,TextFilters,PostActionSvc) {
         $scope.PostBox = PostActionSvc;

       // Could send this to the server for statistics
      console.log(navigator.userAgent);
    //console.log($cookies.uid);


         $scope.Tabs = {};
    $scope.Tabs.tabNumber = 0;
        $scope.Tabs.showTabs = true;

    $scope.Modal = {};
    $scope.Modal.modalIsOpened = false;

        $scope.ContextFilters = {};

        TextFilters.initializeFiltersToUndefined();

        $scope.currentText = {txt : ""};

       // Will go in a user profile form and a user info service
     $scope.nomPersoUtilisateur = "";
     $scope.nomProUtilisateur = "";

       PostActionSvc.gulp('Init','Init','App','Init');


         //Activate the Bootstrap popover option
       $('#popoverCopier').popover({
           html: true,
           content: "Androïd : appuyer trois secondes sur le texte + icône sélection (T) + icône copier (feuilles)<br>iPhone : appuyer trois secondes sur le texte + relâcher + appuyer encore trois secondes + 'sélectionner tout' + 'copier'"
       });

    // Temporary compatibility with old controllers
    function OldInitializationCode() {
       $scope.MenuPanel = {};
         $scope.MenuPanel.showIntentions = true; // !!!!!!!
       $scope.MenuPanel.showQui = false;
       $scope.MenuPanel.page = "home";
       $scope.IntentionPanel = {};
     }
   }
   ]);

//      OLD CODE

// Pour sélectionner un tab par programme
//       $('#myTab a:last').tab('show'); // Select first tab


