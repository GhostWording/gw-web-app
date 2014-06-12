angular.module('app/routing', [])

.config(['$routeProvider',
    function ($routeProvider) { $routeProvider
     // Special case : if the area is Addressee, we first need to ask for the recipient
    .when('/area/Addressee/intention', {
      redirectTo: '/area/Addressee/recipient'
    })
    // Duplicate wiht languageCode
    .when('/:languageCode/area/Addressee/intention', {
      redirectTo: '/:languageCode/area/Addressee/recipient'
    })
    // if there is no recipient, just go to the intention list
    .when('/area/:areaName/intention/none', {
      redirectTo: '/area/:areaName/intention'
    })
    // Duplicate wiht languageCode
    .when('/:languageCode/area/:areaName/intention/none', {
      redirectTo: '/:languageCode/area/:areaName/intention'
    })
    .when('/area/Addressee/intention/:recipientId', {
      redirectTo: '/area/Addressee/recipient/:recipientId'
    })
    // Duplicate wiht languageCode
    .when('/:languageCode/area/Addressee/intention/:recipientId', {
      redirectTo: '/:languageCode/area/Addressee/recipient/:recipientId'
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
    // Duplicate wiht languageCode
    .when('/:languageCode/area/:areaName/intention', {
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
    // Duplicate wiht languageCode
    .when('/:languageCode/area/:areaName/recipient/:recipientId', {
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
    // Duplicate wiht languageCode
    .when('/:languageCode/area/:areaName/intention/:intentionId/recipient/:recipientId/text', {
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
    // Duplicate with language code
    .when('/:languageCode/addressee/:recipientId/:intentionId', {
      redirectTo: '/area/Addressee/intention/:intentionId/recipient/:recipientId/text/'
    })
    // Text detail
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
    // Duplicate with language code
    .when('/:languageCode/area/:areaName/intention/:intentionId/recipient/:recipientId/text/:textId', {
      templateUrl: 'views/textdetail.html',
      controller: 'TextDetailController',
      resolve: {
        currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
        currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
        currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }],
        currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
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
    // Favourite texts
    .when('/favouriteTexts', {
        templateUrl: 'views/favouriteText.html',
        controller: 'FavouritesListController',
        resolve: {
            favourites: ['favouritesSvc', function(favouritesSvc) { return favouritesSvc.favourites; }]
        }
    })
    // Duplicate with language code
    .when('/:languageCode/favouriteTexts', {
      templateUrl: 'views/favouriteText.html',
      controller: 'FavouritesListController',
      resolve: {
        favourites: ['favouritesSvc', function(favouritesSvc) { return favouritesSvc.favourites; }]
      }
    })
    // Suscribable recipients
    .when('/favoriteRecipients', {
        templateUrl: 'views/favoriteRecipients.html',
        controller: 'SubscribedRecipientsController',
        resolve: {
            recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
        },
        showTabs: false
    })
      // Duplicate with language code
    .when('/:languageCode/favoriteRecipients', {
      templateUrl: 'views/favoriteRecipients.html',
      controller: 'SubscribedRecipientsController',
      resolve: {
        recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
      },
      showTabs: false
    })
      // Recipients
    .when('/area/:areaName/recipient', {
      templateUrl: 'views/recipientList.html',
      controller: 'OneTimeRecipientsController',
      resolve: {
        recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
      },
      showTabs: true
    })
    // Duplicate with language code
    .when('/:languageCode/area/:areaName/recipient', {
      templateUrl: 'views/recipientList.html',
      controller: 'OneTimeRecipientsController',
      resolve: {
        recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
      },
      showTabs: false
    })
    .when('/recipientList', {
      redirectTo: '/area/Addressee/recipient'
    })
    // Duplicate with language code
    .when('/:languageCode/recipientList', {
      redirectTo: '/:languageCode/area/Addressee/recipient'
    })
    .when('/subscriptions', {
        templateUrl: 'views/subscriptions.html',
        controller: 'SubscriptionController',
        resolve: {
            recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
        },
        showTabs: false
    })
    // Duplicate with language code
    .when('/:languageCode/subscriptions', {
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
    // Duplicate with language code
    .when('/:languageCode/userEMail', {
      templateUrl: 'views/userEMail.html',
      controller: 'UserEMailController'
    })

    .when('/notimplemented', {
        templateUrl: 'views/notimplemented.html',
        controller: 'NotImplementedController'
    })
      // Duplicate with language code
    .when('/:languageCode/notimplemented', {
      templateUrl: 'views/notimplemented.html',
      controller: 'NotImplementedController'
    })

    .when('/userprofile', {
        templateUrl: 'views/userprofile.html',
        controller: 'UserProfileController'
    })
      // Duplicate with language code
    .when('/:languageCode/userprofile', {
      templateUrl: 'views/userprofile.html',
      controller: 'UserProfileController'
    })

    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'SimplePageController'
    })
      // Duplicate with language code
    .when('/:languageCode/about', {
      templateUrl: 'views/about.html',
      controller: 'SimplePageController'
    })

    .when('/BonneAnnee', {
        redirectTo: '/fr/area/Friends/intention/938493/text'
    })
    .when('/Amour', {
        redirectTo: '/fr/area/LoveLife/intention'
    })
    .when('/Amis', {
        redirectTo: '/fr/area/Friends/intention'
    })
    .when('/Famille', {
        redirectTo: '/fr/area/Family/intention'
    })
    .when('/', {
      templateUrl: 'views/splashscreen.html',
      controller: 'SplashScreenController'
    })
    .when('/:languageCode', {
      templateUrl: 'views/splashscreen.html',
      controller: 'SplashScreenController'
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