// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'postActionSvc','appUrlSvc','intentionsSvc','textsSvc',
function ($scope,currentLanguage,postActionSvc,appUrlSvc,intentionsSvc,textsSvc) {
  postActionSvc.postActionInfo('Init','Page','Welcome','Init');

  $scope.isFrench = currentLanguage.isFrenchVersion();

  $scope.targetDatas = [
    { 'targetId':'I-think-of-you', 'targetUrl':'area/Addressee/recipient/SweetheartF/intention/016E91/text/random12FirstTime', 'targetLabel': 'Je pense à toi',
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/loveinterest/istockpairs/small/iStock_000015884455_Medium.jpg'  },

    { 'targetId':'I-like-you',      'targetUrl':'area/Addressee/recipient/LoveInterestF/intention/64B504/text/random12FirstTime','targetLabel': 'Tu me plais',
      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/I-like-you/default/small/iStock_000013907982_Medium.jpg'  },

    { 'targetId':'thank-you',       'targetUrl':'area/Addressee/recipient/CloseFriends/intention/1778B7/text/random12FirstTime', 'targetLabel': 'Merci',
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/fbfriend/stockanimals/small/iStock_000009443318_Medium.jpg'  },

    { 'targetId':'I-miss-you', 'targetUrl':'area/Addressee/recipient/SweetheartF/intention/8ED62C/text/random12FirstTime', 'targetLabel': 'Tu me manques',
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/loveinterest/otherlove/small/shutterstock_32076445.jpg'  },

    { 'targetId':'I-am-here-for-you',      'targetUrl':'area/Addressee/recipient/CloseFriends/intention/03B6E4/text/random12FirstTime','targetLabel': 'Je suis là pour toi à un ami',
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/fbfriend/stockanimals/small/shutterstock_101654053.jpg'  },

    { 'targetId':'happy-birthday',  'targetUrl':'area/Addressee/recipient/CloseFriends/intention/A730B4/text/random12FirstTime', 'targetLabel': 'Bon anniversaire',
      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/happy-birthday/default/small/iStock_000002415327_Medium.jpg'  },

    { 'targetId':'sorry', 'targetUrl':'area/Addressee/recipient/CloseFriends/intention/70D12F/text/random12FirstTime', 'targetLabel': "Pardon",
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/fbfriend/other/small/iStock_000002709786_Full.jpg'  },
    
    { 'targetId':'I-love-you', 'targetUrl':'area/Addressee/recipient/SweetheartF/intention/5CDCF2/text/random12FirstTime', 'targetLabel': "Je t'aime",
      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/I-love-you/default/small/iStock_000008451325_Full.jpg'  },


//    { 'targetId':'what-is-up-with-you-lately', 'targetUrl':'area/Addressee/recipient/LongLostFriend/intention/F82B5C/text/random12FirstTime', 'targetLabel': 'Que deviens-tu',
//      'imageUrl':'http://az767698.vo.msecnd.net/cvd/fbfriend/other/small/shutterstock_165351512.jpg'  },

    { 'targetId':'facebook-status', 'targetUrl':'area/Addressee/recipient/OtherFriends/intention/2E2986/text/random12FirstTime', 'targetLabel': 'Votre statut facebook',
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/fbfriend/other/small/iStock_000013939977_Large.jpg'  },


    // I-want-you, Je t'aime, Surprends-moi,Quelques mots pour toi, Un peu d'humour
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