// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'postActionSvc','appUrlSvc','intentionsSvc','textsSvc',
function ($scope,currentLanguage,postActionSvc,appUrlSvc,intentionsSvc,textsSvc) {
  postActionSvc.postActionInfo('Init','Page','Welcome','Init');

  $scope.isFrench = currentLanguage.isFrenchVersion();

  $scope.targetDatas = [
    { 'targetId':'thank-you',       'targetUrl':'area/Addressee/recipient/CloseFriends/intention/1778B7/text/random12FirstTime', 'targetLabel': 'Merci',
      'imageUrl':'http://gw-static.azurewebsites.net/cvd/fbfriend/stockanimals/small/iStock_000009443318_Medium.jpg'  },
    { 'targetId':'I-like-you',      'targetUrl':'area/Addressee/recipient/LoveInterestF/intention/64B504/text/random12FirstTime','targetLabel': 'Tu me plais',
      'imageUrl':'http://gw-static.azurewebsites.net/specialoccasions/I-like-you/default/small/iStock_000013907982_Medium.jpg'  },
    { 'targetId':'happy-birthday',  'targetUrl':'area/Addressee/recipient/CloseFriends/intention/A730B4/text/random12FirstTime', 'targetLabel': 'Bon anniversaire',
      'imageUrl':'http://gw-static.azurewebsites.net/specialoccasions/happy-birthday/default/small/shutterstock_109536749.jpg'  },
    { 'targetId':'facebook-status', 'targetUrl':'area/Addressee/recipient/OtherFriends/intention/2E2986/text/random12FirstTime', 'targetLabel': 'Votre statut facebook',
      'imageUrl':'http://gw-static.azurewebsites.net/cvd/fbfriend/stockanimals/small/shutterstock_101654053.jpg'  }
  ];

  appUrlSvc.setUserHasBeenOnSplashScreen(true);

  var skipTracker =  true;
// Preload intentions
  intentionsSvc.getIntentionsForArea('General',skipTracker);
  intentionsSvc.getIntentionsForArea('Addressee',skipTracker);

  // Preload text lists
    // TODO : that only works for French users : we should user the version with intention ids. "joyeux-anniversaire.en-EN" will not be a usefull cache entry
  var makeShortVersionAndSort =  true;
  textsSvc.getTextList('Addressee', 'joyeux-anniversaire', currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'je-pense-a-toi',currentLanguage.currentCulture(),skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'statuts-facebook',currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'merci',currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'tu-me-plais',currentLanguage.currentCulture(),skipTracker,makeShortVersionAndSort);

}]);