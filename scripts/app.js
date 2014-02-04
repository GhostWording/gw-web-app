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


cherryApp.controller('NavBarController',  ['$scope',
    function ($scope) {
    }
]);

cherryApp.controller('CherryControler', ['$scope', '$cookies', 'NormalTextFilters', 'PostActionSvc', 'Tabs',
    function ($scope, $cookies, TextFilters, PostActionSvc, Tabs) {
        console.log(navigator.userAgent);

        $scope.Tabs = Tabs;
        $scope.Modal = {};
        $scope.Modal.modalIsOpened = false;

        $scope.ContextFilters = {};

        TextFilters.initializeFiltersToUndefined();

        $scope.currentText = {txt: ""};

        PostActionSvc.postActionInfo('Init', 'Init', 'App', 'Init');
//        PostActionSvc('Init', 'Init', 'App', 'Init');

        //Activate Bootstrap popover option
        $('#popoverCopier').popover({
            html: true,
            content: "Androïd : appuyer trois secondes sur le texte + icône sélection (T) + icône copier (feuilles)<br>iPhone : appuyer trois secondes sur le texte + relâcher + appuyer encore trois secondes + 'sélectionner tout' + 'copier'"
        });
    }
]);

//      OLD CODE

// Pour sélectionner un tab par programme
//       $('#myTab a:last').tab('show'); // Select first tab


