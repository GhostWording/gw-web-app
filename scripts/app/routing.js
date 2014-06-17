angular.module('app/routing', ['ui.router'])

.value('$stateChange', { toState: {}, toParams: {}, fromState: {}, fromParams: {} })

.run(['$rootScope', '$stateChange', function($rootScope, $stateChange) {
  function updateTransition(event, toState, toParams, fromState, fromParams) {
    $stateChange.toState = toState;
    $stateChange.toParams = toParams;
    $stateChange.fromState = fromState;
    $stateChange.fromParams = fromParams;
  }

  // Ensure state transition info is available to be injected during a state transition
  $rootScope.$on('$stateChangeStart', updateTransition);
  $rootScope.$on('$stateChangeError', updateTransition);
  $rootScope.$on('$stateChangeSuccess', updateTransition);
}])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  // Set up the redirects
  // (most of these have a duplicate redirect with language code)
  $urlRouterProvider

    // Special case : if the area is Addressee, we first need to ask for the recipient
    .when('/recipientList', '/area/Addressee/recipient')
    .when('/:languageCode/recipientList', '/:languageCode/area/Addressee/recipient')

    .when('/area/Addressee/intention', '/area/Addressee/recipient')
    .when('/:languageCode/area/Addressee/intention', '/:languageCode/area/Addressee/recipient')

    // if there is no recipient, just go to the intention list
    .when('/area/:areaName/intention/none', '/area/:areaName/intention')
    .when('/:languageCode/area/:areaName/intention/none', '/:languageCode/area/:areaName/intention')

    .when('/area/Addressee/intention/:recipientId', '/area/Addressee/recipient/:recipientId')
    .when('/:languageCode/area/Addressee/intention/:recipientId', '/:languageCode/area/Addressee/recipient/:recipientId')

    // shortcut : text list for recipient and intention like /addressee/Father/xxxx
    .when('/addressee/:recipientId/:intentionId', '/area/Addressee/intention/:intentionId/recipient/:recipientId/text/')
    .when('/:languageCode/addressee/:recipientId/:intentionId', '/:languageCode/area/Addressee/intention/:intentionId/recipient/:recipientId/text/')



    .when('/BonneAnnee', '/area/Friends/intention/938493/text')
    .when('/Amour', '/area/LoveLife/intention')
    .when('/Amis', '/area/Friends/intention')
    .when('/Famille', '/area/Family/intention');

  $stateProvider


  .state('area', {
    url: '/area/:areaName/intention',
    templateUrl: 'views/intentionList.html',
    controller: 'IntentionListController',
    resolve: {
      currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
    },
    showTabs: true
  })
  .state('areaWithLanguage', {
    url: '/:languageCode/area/:areaName/intention',
    templateUrl: 'views/intentionList.html',
    controller: 'IntentionListController',
    resolve: {
      currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
    },
    showTabs: true
  })

    // Text list for an intention, and a recipient. Recipient can be 'none'
  .state('areaWithRecipientWithLanguage', {
    url: '/:languageCode/area/:areaName/recipient/:recipientId',
    templateUrl: 'views/intentionList.html',
    controller: 'IntentionListController',
    resolve: {
      currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
      currentTextList: ['textsSvc', function(textsSvc) { return textsSvc.getCurrentList(); }],
      currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
    },
    showTabs: true
  })

    // Text list for an intention, and a recipient. Recipient can be 'none'
  .state('textList', {
    url: '/area/:areaName/intention/:intentionId/recipient/:recipientId/text',
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
  // Text list for an intention, and a recipient. Recipient can be 'none'
  .state('textListWithLanguage', {
    url: '/:languageCode/area/:areaName/intention/:intentionId/recipient/:recipientId/text',
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


  .state('textListWithLanguage.textDetail', {
    url: '/:textId',
    templateUrl: 'views/textdetail.html',
    controller: 'TextDetailController',
    resolve: {
      // other resolves should be inherited from parents
      currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }]
    }
  })

  .state('textDetailWithLanguage', {
    url: '/:languageCode/area/:areaName/intention/:intentionId/recipient/:recipientId/text/:textId',
    templateUrl: 'views/textdetail.html',
    controller: 'TextDetailController',
    resolve: {
      currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
      currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
      currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }],
      currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
    }
  })


  .state('recipients', {
    url: '/area/:areaName/recipient',
    templateUrl: 'views/recipientList.html',
    controller: 'OneTimeRecipientsController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: true
  })
  .state('recipientsWithLanguage', {
    url: '/:languageCode/area/:areaName/recipient',
    templateUrl: 'views/recipientList.html',
    controller: 'OneTimeRecipientsController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: true
  })

  .state('favourites', {
    url: '/favoriteRecipients',
    templateUrl: 'views/favoriteRecipients.html',
    controller: 'SubscribedRecipientsController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: false
  })
  .state('favouritesWithLanguage', {
    url: '/:languageCode/favoriteRecipients',
    templateUrl: 'views/favoriteRecipients.html',
    controller: 'SubscribedRecipientsController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: false
  })




  .state('subscriptions', {
    url: '/subscriptions',
    templateUrl: 'views/subscriptions.html',
    controller: 'SubscriptionController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: false
  })
  .state('subscriptionsWithLanguage', {
    url: '/:languageCode/subscriptions',
    templateUrl: 'views/subscriptions.html',
    controller: 'SubscriptionController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: false
  })


  .state('userEmail', {
    url: '/userEMail',
    templateUrl: 'views/userEMail.html',
    controller: 'UserEMailController'
  })
  .state('userEmailWithLanguage', {
    url: '/"languageCode/userEMail',
    templateUrl: 'views/userEMail.html',
    controller: 'UserEMailController'
  })


  .state('not-implemented', {
    url: '/notimplemented',
    templateUrl: 'views/notimplemented.html',
    controller: 'NotImplementedController'
  })
  .state('notImplementedWithLanguage', {
    url: '/:languageCode/notimplemented',
    templateUrl: 'views/notimplemented.html',
    controller: 'NotImplementedController'
  })


  .state('userprofile', {
    url: '/userprofile',
    templateUrl: 'views/userprofile.html',
    controller: 'UserProfileController'
  })
  .state('userprofileWithLanguage', {
    url: '/:languageCode/userprofile',
    templateUrl: 'views/userprofile.html',
    controller: 'UserProfileController'
  })


  .state('about', {
    url: '/about',
    templateUrl: 'views/about.html',
    controller: 'SimplePageController'
  })
  .state('aboutWithLanguage', {
    url: '/:languageCode/about',
    templateUrl: 'views/about.html',
    controller: 'SimplePageController'
  })


  .state('splashscreen', {
    url: '/',
    templateUrl: 'views/splashscreen.html',
    controller: 'SplashScreenController'
  })
  .state('splashscreenWithLanguage', {
    url: '/:languageCode',
    templateUrl: 'views/splashscreen.html',
    controller: 'SplashScreenController'
  });



 $urlRouterProvider.otherwise('/');




}]);