// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'postActionSvc','appUrlSvc','intentionsSvc','textsSvc',
  function ($scope,currentLanguage,postActionSvc,appUrlSvc,intentionsSvc,textsSvc) {
  postActionSvc.postActionInfo('Init','Page','Welcome','Init');

  $scope.isFrench = currentLanguage.isFrenchVersion();

  appUrlSvc.setUserHasBeenOnSplashScreen(true);

  var skipTracker =  true;
// Preload intentions
  intentionsSvc.getIntentionsForArea('General',skipTracker);
  intentionsSvc.getIntentionsForArea('Addressee',skipTracker);
  //intentionsSvc.getIntentionsForArea('Friends',skipTracker);
  //intentionsSvc.getIntentionsForArea('LoveLife',skipTracker);
  //intentionsSvc.getIntentionsForArea('Family',skipTracker);

  // Preload text lists
    // TODO : that only works for French users : we should user the version with intention ids. "joyeux-anniversaire.en-EN" will not be a usefull cache entry
  var makeShortVersionAndSort =  true;
  textsSvc.getTextList('Addressee', 'joyeux-anniversaire', currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'je-pense-a-toi',currentLanguage.currentCulture(),skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'statuts-facebook',currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'merci',currentLanguage.currentCulture(), skipTracker,makeShortVersionAndSort);
  textsSvc.getTextList('Addressee', 'tu-me-plais',currentLanguage.currentCulture(),skipTracker,makeShortVersionAndSort);

}]);