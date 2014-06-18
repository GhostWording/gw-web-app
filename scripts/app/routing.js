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

    // RecientList shortcut
    .when('/recipientList'                                      , '/area/Addressee/recipient')
    .when('/:languageCode/recipientList'           ,'/:languageCode/area/Addressee/recipient')
      // Special case for the Adressee area : if we have no recipient, look for it
    .when('/:languageCode/area/Addressee/intention','/:languageCode/area/Addressee/recipient')
    .when('/:languageCode/area/Addressee/recipient/none/intention','/:languageCode/area/Addressee/recipient')

    // shortcut : text list for a specific recipient and intention like /addressee/Father/xxxx
    .when('/addressee/:recipientId/:intentionId', '/area/Addressee/recipient/:recipientId/intention/:intentionId/text/')
    .when('/:languageCode/addressee/:recipientId/:intentionId', '/:languageCode/area/Addressee/recipient/:recipientId/intention/:intentionId/text/')

//    .when('/area/:areaName/intention/none', '/area/:areaName/recipient/none/intention')
//    .when('/:languageCode/area/:areaName/intention/none', '/:languageCode/area/:areaName/recipient/none/intention')

    //.when('/blabla','/xx/blabla')
    // on $stateChangeSuccess, the added "xx" string will be replaced by the current (or default) language code
    .when('/userprofile'              ,'/xx/userprofile')
    .when('/about'                    ,'/xx/about')
    .when('/favoriteRecipients'       ,'/xx/favoriteRecipients')
    .when('/subscriptions'            ,'/xx/subscriptions')
    .when('/userEMail'                ,'/xx/userEMail')
    .when('/notimplemented'           ,'/xx/notimplemented')

    .when('/area/:areaName/recipient' ,'/xx/area/:areaName/recipient')
    .when('/area/:areaName/recipient/:recipientId/intention','/xx/area/:areaName/recipient/:recipientId/intention')
    .when('/area/:areaName/recipient/:recipientId/intention/:intentionId/text','/xx/area/:areaName/recipient/:recipientId/intention/:intentionId/text')

    .when('/Amour',      '/fr/area/LoveLife/recipient/none/intention')
    .when('/Amis',       '/fr/area/Friends/recipient/none/intention')
    .when('/Famille',    '/fr/area/Family/recipient/none/intention')
    .when('/BonneAnnee', '/fr/area/Friends/recipient/none/intention/bonne-annee/text');

  $stateProvider
  .state('area', {
    abstract: true,
    template: '<ui-view/>',
    url:'/:languageCode/area/:areaName',
    resolve: {
      // currentAreaName will be available to child states
      currentAreaName: ['$stateParams', 'areasSvc' , function ($stateParams, areasSvc) {
        var areaName = $stateParams.areaName;
        areasSvc.setCurrentName(areaName);
        // We do not want to resolve this before texts are displayed !!
        //areasSvc.invalidateCacheIfNewerServerVersionExists(areaName);
        return areaName;  } ]
    }
    })
    // We might want recipientList, intentionList and text list to be siblings
  .state('area.recipientList', {
    url: '/recipient',
    templateUrl: 'views/recipientList.html',
    controller: 'OneTimeRecipientsController',
    resolve: {
      recipients: ['subscribableRecipientsSvc', function(subscribedRecipientsSvc) { return subscribedRecipientsSvc.getAll(); }]
    },
    showTabs: true
  })
  // Intention list for area and recipient.
  .state('area.intentionList', {
    url: '/recipient/:recipientId/intention',
    templateUrl: 'views/intentionList.html',
    controller: 'IntentionListController',
    resolve: {
      currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }],
    },
    showTabs: true
  })
  // Text list for an intention, and a recipient. Recipient can be 'none'
  .state('area.textList', {
    url: '/recipient/:recipientId/intention/:intentionId/text',
    templateUrl: 'views/textList.html',
    controller: 'TextListController',
    resolve: {
      currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
      currentTextList: ['textsSvc', function(textsSvc) { return textsSvc.getCurrentList(); }],
      currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
    },
    showTabs: true
  })
  .state('area.textList.textDetail', {
    url: '/:textId',
    templateUrl: 'views/textdetail.html',
    controller: 'TextDetailController',
    resolve: {
      currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }]
    }
  })
  .state('favoriteRecipients', {
    url: '/:languageCode/favoriteRecipients',
    templateUrl: 'views/favoriteRecipients.html',
    controller: 'SubscribedRecipientsController',
    showTabs: false
  })
  .state('subscriptions', {
    url: '/:languageCode/subscriptions',
    templateUrl: 'views/subscriptions.html',
    controller: 'SubscriptionController',
    showTabs: false
  })
  .state('userEmail', {
    url: '/:languageCode/userEMail',
    templateUrl: 'views/userEMail.html',
    controller: 'UserEMailController'
  })
  .state('notimplemented', {
    url: '/:languageCode/notimplemented',
    templateUrl: 'views/notimplemented.html',
    controller: 'NotImplementedController'
  })
  .state('userprofile', {
    url: '/:languageCode/userprofile',
    templateUrl: 'views/userprofile.html',
    controller: 'UserProfileController'
  })
  .state('about', {
    url: '/:languageCode/about',
    templateUrl: 'views/about.html',
    controller: 'SimplePageController'
  })
  // It might be pretier to have a clean url for the home page
  .state('splashscreenNoLanguage', {
    url: '/',
    templateUrl: 'views/splashscreen.html',
    controller: 'SplashScreenController'
  })
  .state('splashscreen', {
    url: '/:languageCode',
    templateUrl: 'views/splashscreen.html',
    controller: 'SplashScreenController'
  });



 $urlRouterProvider.otherwise('/');




}]);