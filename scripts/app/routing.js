angular.module('app/routing', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider
    // Special case : if the area is Addressee, we first need to ask for the recipient
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


    .when('/recipientList', '/area/Addressee/recipient')
    .when('/BonneAnnee', '/area/Friends/intention/938493/text')
    .when('/Amour', '/area/LoveLife/intention')
    .when('/Amis', '/area/Friends/intention')
    .when('/Famille', '/area/Family/intention')
    .otherwise('/');

  $stateProvider

  .state('area', {
    url: '/area/:areaName?recipient',
    templateUrl: 'views/intentionList.html',
    controller: 'IntentionListController',
    showTabs: true
  })


  .state('area.intention', {
    url: '/intention/:intentionId',
    templateUrl: 'views/textList.html',
    controller: 'TextListController',
  })


  .state('area.intention.text', {
    url: '/text/:textId',
    templateUrl: 'views/textdetail.html',
    controller: 'TextDetailController'
  })


  .state('favourites', {
    url: '/favoriteRecipients',
    templateUrl: 'views/favoriteRecipients.html',
    controller: 'SubscribableRecipientsController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: false
  })


  .state('recipients', {
    url: '/recipients',
    templateUrl: 'views/recipientList.html',
    controller: 'OneTimeRecipientsController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: true
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


  .state('user-email', {
    url: '/userEMail',
    templateUrl: 'views/userEMail.html',
    controller: 'UserEMailController'
  })


  .state('not-implemented', {
    url: '/notimplemented',
    templateUrl: 'views/notimplemented.html',
    controller: 'NotImplementedController'
  })


  .state('userprofile', {
    url: '/userprofile',
    templateUrl: 'views/userprofile.html',
    controller: 'UserProfileController'
  })


  .state('splashscreen', {
    url: '/',
    templateUrl: 'views/splashscreen.html',
    controller: 'SplashScreenController'
  })


  .state('about', {
    url: '/about',
    templateUrl: 'views/about.html',
    controller: 'SimplePageController'
  })


  // Shortcut for human readable link : must be placed after other single piece parameter urls
  .state('intention-slug', {
    url:  '/:intentionSlug',
    templateUrl: 'views/textList.html',
    controller: 'TextListController'
  });


  $urlRouterProvider
    // Special case : if the area is Addressee, we first need to ask for the recipient
    .when('/area/Addressee/intention', '/area/Addressee/recipient')
    .when('/area/Addressee/intention/:recipientId', '/area/Addressee/recipient/:recipientId')
    // shortcut : text list for recipient and intention like /addressee/Father/xxxx
    .when('/addressee/:recipientId/:intentionId', '/area/Addressee/intention/:intentionId/recipient/:recipientId/text/')
    .when('/recipientList', '/area/Addressee/recipient')
    .when('/BonneAnnee', '/area/Friends/intention/938493/text')
    .when('/Amour', '/area/LoveLife/intention')
    .when('/Amis', '/area/Friends/intention')
    .when('/Famille', '/area/Family/intention')
    .otherwise('/');

  // // Shortcut for human readable link
  // // TODO: Move this to a redirect on the server??
  // .when('/:areaName/:intentionId', function($match) {

  //   templateUrl: 'views/textList.html',
  //   controller: 'TextListController',
  //   resolve: {
  //     currentArea: ['areasSvc', function(areasSvc) { return areasSvc.getCurrent(); }],
  //     currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }]
  //   }
  // })


}]);