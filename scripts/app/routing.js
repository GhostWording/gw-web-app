angular.module('app/routing', [])

.config(['$routeProvider', function ($routeProvider) { $routeProvider
     // Special case : if the area is Addressee, we first need to ask for the recipient
    .when('/area/Addressee/intention', {
      redirectTo: '/area/Addressee/recipient'
    })
  // if there is no recipient, just go to the intention list
    .when('/area/:areaName/intention/none', {
      redirectTo: '/area/:areaName/intention'
    })
    .when('/area/Addressee/intention/:recipientId', {
      redirectTo: '/area/Addressee/recipient/:recipientId'
    })
    //
    // Intention list for an area
    .when('/area/:areaName/intention', {
        templateUrl: 'views/intentionList.html',
        controller: 'IntentionListController',
        resolve: {
          currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
          currentRecipient: ['currentRecipientSvc', function(currentRecipient) { return null; }]
        },
        showTabs: true
    })
    // Intention list for an area and a recipient
    .when('/area/:areaName/recipient/:recipientId', {
      templateUrl: 'views/intentionList.html',
      controller: 'IntentionListController',
      resolve: {
        currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
        currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
      },
      showTabs: true
    })
  // Text list for an intention, and a recipient. Recipient can be 'none'
    .when('/area/:areaName/intention/:intentionId/recipient/:recipientId/text', {
      templateUrl: 'views/textList.html',
      controller: 'TextListController',
      resolve: {
        currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
        currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
        currentTextList: ['textsSvc', function(textsSvc) { return textsSvc.getCurrentList(); }],
        currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
      },
      showTabs: true
    })
    // shortcut : text list for recipient and intention like /addressee/Father/xxxx
    .when('/addressee/:recipientId/:intentionId', {
      redirectTo: '/area/Addressee/intention/:intentionId/recipient/:recipientId/text/'
    })
    //.when('/area/:areaName/intention/:intentionId/text/:textId', {
    .when('/area/:areaName/intention/:intentionId/recipient/:recipientId/text/:textId', {
        templateUrl: 'views/textdetail.html',
        controller: 'TextDetailController',
        resolve: {
            currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
            currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
            currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }],
            currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
        }
    })
    .when('/area/:areaName/intention/:intentionId/recipient//text/:textId', {
      templateUrl: 'views/textdetail.html',
      controller: 'TextDetailController',
      resolve: {
        currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
        currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
        currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }],
        currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return null; }]
      }
    })
    // Not sure to use this one
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

    .when('/favouriteTexts', {
        templateUrl: 'views/favouriteText.html',
        controller: 'FavouritesListController',
        resolve: {
            favourites: ['favouritesSvc', function(favouritesSvc) { return favouritesSvc.favourites; }]
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
    .when('/area/:areaName/recipient', {
      templateUrl: 'views/recipientList.html',
      controller: 'OneTimeRecipientsController',
      resolve: {
        recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
      },
      showTabs: true
    })
    .when('/recipientList', {
      redirectTo: '/area/Addressee/recipient'
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


    // Shortcut for human readable link : must be placed after other single piece parameter urls
//    .when('/:intentionSlug', {
//        templateUrl: 'views/textList.html',
//        controller: 'TextListController'
//    })
    .otherwise({
        redirectTo: '/'
    });
}]);