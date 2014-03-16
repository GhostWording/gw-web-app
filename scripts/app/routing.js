angular.module('app/routing', [])

.config(['$routeProvider', function ($routeProvider) { $routeProvider
    .when('/area/:areaName/intention', {
        templateUrl: 'views/intentionList.html',
        controller: 'NewIntentionListController',
        resolve: {
            currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }]
        },
        showTabs: true
    })
    .when('/area/:areaName/intention/:intentionId/text', {
        templateUrl: 'views/textList.html',
        controller: 'TextListController',
        resolve: {
            currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
            currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
            currentTextList: ['textsSvc', function(textsSvc) { return textsSvc.getCurrentList(); }],
            currentRecipient: ['currentRecipientSvc', function(currentRecipient) { return null; }]
        },
        showTabs: true
    })
    // New : text list for a recipient and an intention
    .when('/area/:areaName/intention/:intentionId/:recipientId', {
      templateUrl: 'views/textList.html',
      controller: 'TextListController',
      resolve: {
        currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
        currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
        currentTextList: ['textsSvc', function(textsSvc) { return textsSvc.getCurrentList(); }],
        currentRecipient: ['currentRecipientSvc', function(currentRecipient) { return currentRecipient.getCurrentRecipient(); }]
      },
      showTabs: true
    })
    .when('/area/:areaName/intention/:intentionId/text/:textId', {
        templateUrl: 'views/textdetail.html',
        controller: 'TextDetailController',
        resolve: {
            currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
            currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
            currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }]
        }
    })

    .when('/area/:areaName/text/:textId', {
        templateUrl: 'views/textdetail.html',
        controller: 'TextDetailController',
        resolve: {
            currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }]
        }
    })

    // Shortcut for human readable link
    // TODO: Move this to a redirect on the server??
    .when('/:areaName/:intentionId', {
        templateUrl: 'views/textList.html',
        controller: 'TextListController',
        resolve: {
            currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
            currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }]
        }
    })

    .when('/favoriteRecipients', {
        templateUrl: 'views/favoriteRecipients.html',
        controller: 'SubscribableRecipientsController',
        resolve: {
            recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
        },
        showTabs: false
    })
    .when('/recipientList', {
      templateUrl: 'views/recipientList.html',
      controller: 'OneTimeRecipientsController',
      resolve: {
        recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
      },
      showTabs: false
    })
    .when('/subscriptions', {
        templateUrl: 'views/subscriptions.html',
        controller: 'SubscriptionController',
        resolve: {
            recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
        },
        showTabs: false
    })
    .when('/userEMail', {
        templateUrl: 'views/userEMail.html',
        controller: 'UserEMailController'
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
    .when('/Amour', {
        redirectTo: '/area/LoveLife/intention'
    })
    .when('/Amis', {
        redirectTo: '/area/Friends/intention'
    })
    .when('/Famille', {
        redirectTo: '/area/Family/intention'
    })
    .when('/addressee/:recipientId/:intentionId', {
      redirectTo: '/area/Addressee/intention/:intentionId/:recipientId'
    })

    // Shortcut for human readable link : must be placed after other single piece parameter urls
    .when('/:intentionSlug', {
        templateUrl: 'views/textList.html',
        controller: 'TextListController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);