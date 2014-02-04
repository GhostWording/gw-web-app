cherryApp.config(['$routeProvider', function ($routeProvider) { $routeProvider
    .when('/area/:areaName/intention', {
        templateUrl: 'views/intentionList.html',
        controller: 'NewIntentionListController',
        showTabs: true
    })
    .when('/area/:areaId/intention/:intentionId/text', {
        templateUrl: 'views/textList.html',
        controller: 'TextListController',
        showTabs: true
    })

    // New : use longer url tracing intentionId for single text
    .when('/area/:areaId/intention/:intentionId/text/:textId', {
        templateUrl: 'views/textdetail.html',
        controller: 'TextDetailController'
    })

    .when('/area/:areaId/text/:textId', {
        templateUrl: 'views/textdetail.html',
        controller: 'TextDetailController'
    })

    // Shortcut for human readable link
    .when('/:areaId/:intentionId', {
        templateUrl: 'views/textList.html',
        controller: 'TextListController'
    })

    .when('/recipients', {
        templateUrl: 'views/recipients.html',
        controller: 'RecipientListController',
        showTabs: true,
        tabName: 'special'
    })

    .when('/notimplemented', {
        templateUrl: 'views/notimplemented.html',
        controller: 'NotImplementedController'
    })

    .when('/userprofile', {
        templateUrl: 'views/userprofile.html',
        controller: 'UserProfileController'
    })
    
//    .when('/splashscreen', {
    .when('/', {
        templateUrl: 'views/splashscreen.html',
        controller: 'SplashScreenController'
    })

    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'SimplePageController'
    })
    .when('/BonneAnnee', {
        redirectTo: '/area/Friends/intention/938493/text'
    })

    // Shortcut for human readable link : must be placed after other single piece parameter urls
    .when('/:intentionSlug', {
        templateUrl: 'views/textList.html',
        controller: 'TextListController'
    })

    .otherwise({
//        redirectTo: '/splashscreen'
        redirectTo: '/'
    });
}]);

