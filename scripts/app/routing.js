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
  $urlRouterProvider

    // RecientList shortcut
    .when('/recipientList'                                      , '/area/Addressee/recipient')
    .when('/:languageCode/recipientList'           ,'/:languageCode/area/Addressee/recipient')

      // Special case for the Adressee area : before we can display intentions, we have to know about the recipient
    .when('/:languageCode/area/Addressee/intention','/:languageCode/area/Addressee/recipient')
    .when('/:languageCode/area/Addressee/recipient/none/intention','/:languageCode/area/Addressee/recipient')

    // transform shortcuts such as  /addressee/Mother/I-think-of-you
    .when('/addressee/:recipientId/:intentionId', '/area/Addressee/recipient/:recipientId/intention/:intentionId/text/')
    .when('/:languageCode/addressee/:recipientId/:intentionId', '/:languageCode/area/Addressee/recipient/:recipientId/intention/:intentionId/text/')

    //.when('/blabla','/xx/blabla')
    // on $stateChangeSuccess xx is replaced by the current language code
    .when('/userprofile'              ,'/xx/userprofile')
    .when('/about'                    ,'/xx/about')
    .when('/favoriteRecipients'       ,'/xx/favoriteRecipients')
    .when('/subscriptions'            ,'/xx/subscriptions')
    .when('/userEMail'                ,'/xx/userEMail')
    .when('/notimplemented'           ,'/xx/notimplemented')
    .when('/fbLogin'                  ,'/xx/fbLogin')
    .when('/area/:areaName/recipient' ,'/xx/area/:areaName/recipient')
    .when('/area/:areaName/recipient/:recipientId/intention','/xx/area/:areaName/recipient/:recipientId/intention')
    .when('/area/:areaName/recipient/:recipientId/intention/:intentionId/text','/xx/area/:areaName/recipient/:recipientId/intention/:intentionId/text')

    .when('/area/:areaName/dashboard/:textId','/xx/area/:areaName/dashboard/:textId')


  // French area shortcuts
    .when('/Amour',      '/fr/area/LoveLife/recipient/none/intention')
    .when('/Amis',       '/fr/area/Friends/recipient/none/intention')
    .when('/Famille',    '/fr/area/Family/recipient/none/intention')
    // French happy new year shortcup
    .when('/BonneAnnee', '/fr/area/Friends/recipient/none/intention/bonne-annee/text')
    // French sashboard  shortcup
    .when('/SauverLeChat',    '/fr/area/General/dashboard')
    .when('/sauverlechat',    '/fr/area/General/dashboard')

    .when('/SaveTheCat',    '/en/area/General/dashboard')
    .when('/savethecat',    '/en/area/General/dashboard')

    // Allow shorter urls with no recipient
    .when('/:languageCode/area/:areaName/intention/:intentionId/text','/:languageCode/area/:areaName/recipient/none/intention/:intentionId/text')
    .when('/:languageCode/area/:areaName/intention/:intentionId/text/:textId','/:languageCode/area/:areaName/recipient/none/intention/:intentionId/text/:textId');

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
  .state('area.dashboard', {
    url: '/dashboard',
    views: {
      '' : {
        templateUrl: 'views/dashboard/dashboard.html',
        controller: 'DashboardController'
      },
      'boardSectionView@area.dashboard': {
        templateUrl: 'views/dashboard/boardSection.html',
        controller: 'BoardSectionController'
      },
      'boardPosterView@area.dashboard': {
        templateUrl: 'views/dashboard/boardPoster.html',
        controller: 'BoardPosterController'
      }
    },
    resolve: { },
    showTabs: false
  })
  .state('area.dashboard.textDetail', {
    //url: '/:textId',
    url: '/:intentionId/:textId',
    templateUrl: 'views/textdetail.html',
    controller: 'TextDetailController',
    resolve: {
      currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
      currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }],
      // That approach wil not work when text detail is reloaded from scratch
      //currentText: ['currentBoardPosterSvc', function(currentBoardPosterSvc) { return currentBoardPosterSvc.getCurrentPoster().posterText; }],
      //currentIntention: ['currentBoardPosterSvc', function(currentBoardPosterSvc) { return currentBoardPosterSvc.getCurrentPoster().section.intention; }],
      currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return undefined; }]
    }
  })
    // We might want recipientList, intentionList and text list to be siblings
  .state('area.recipientList', {
    url: '/recipient',
    templateUrl: 'views/recipientList.html',
    controller: 'SelecteSingleRecipientTypeController',
    resolve: {
      recipients: ['recipientTypesSvc', function(subscribedRecipientTypesSvc) { return subscribedRecipientTypesSvc.getAll(); }]
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
//    templateUrl: 'views/textList.html',
//    controller: 'TextListController',
    resolve: {
      currentIntention: ['intentionsSvc', function(intentionsSvc) { return intentionsSvc.getCurrent(); }],
      currentTextList: ['textsSvc', function(textsSvc) { return textsSvc.getCurrentList(); }],
      currentRecipient: ['currentRecipientSvc', function(currentRecipientSvc) { return currentRecipientSvc.getCurrentRecipient(); }]
    },
    showTabs: true,
    views: {
      '' : {
        templateUrl: 'views/textList.html',
        controller: 'TextListController'
      },
      'questionBarView@': { templateUrl: 'views/partials/questionBar.html', controller: 'QuestionBarController' }
    }
  })
  .state('area.textList.textDetail', {
    url: '/:textId',
    templateUrl: 'views/textdetail.html',
    controller: 'TextDetailController',
    resolve: {
      // Current intention is inherited from parent state
      currentText: ['textsSvc', function(textsSvc) { return textsSvc.getCurrent(); }]
    }
  })
  .state('favoriteRecipients', {
    url: '/:languageCode/favoriteRecipients',
    templateUrl: 'views/favoriteRecipients.html',
    controller: 'SubscribedRecipientTypesController',
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
  .state('fbLogin', {
    url: '/:languageCode/fbLogin',
    templateUrl: 'views/fbLogin.html',
    controller: 'FbLoginController'
  })
  .state('favouriteTexts', {
    url: '/:languageCode/favouriteTexts',
    templateUrl: 'views/favouriteText.html',
    controller: 'FavouriteTextController',
    showTabs: false
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