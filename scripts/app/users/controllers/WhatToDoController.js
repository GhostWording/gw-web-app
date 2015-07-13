angular.module('app/users/WhatToDoController', [])

.controller('WhatToDoController', ['$scope', 'currentUser','postActionSvc',  function ($scope, currentUser,postActionSvc) {
  $scope.user = currentUser;
  postActionSvc.postActionInfo('Init','Page','WhatToDo','Init');

  $scope.targetDatas = [

    { 'targetId':'what-is-up-with-you-lately', 'targetUrl':'area/Addressee/recipient/LongLostFriend/intention/F82B5C/text/random12FirstTime', 'targetLabel': 'Que deviens-tu à un ami perdu de vue',
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/parent/stockparent/small/shutterstock_2755831.jpg'  },

    { 'targetId':'I-am-here-for-you',      'targetUrl':'area/Addressee/recipient/CloseFriends/intention/03B6E4/text/random12FirstTime','targetLabel': 'Je suis là pour toi à un ami',
      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/I-am-here-for-you/default/small/544920_618576124920328_1609964726599096917_n.jpg'  },

    { 'targetId':'I-think-of-you',       'targetUrl':'area/Addressee/recipient/Mother/intention/016E91/text/random12FirstTime', 'targetLabel': 'Je pense à toi à votre maman',
      'imageUrl':'http://az767698.vo.msecnd.net/cvd/parent/stockparent/small/222461_483339658352828_462273154_n.jpg'  },


    { 'targetId':'I-like-you',      'targetUrl':'area/Addressee/recipient/LoveInterestF/intention/64B504/text/random12FirstTime','targetLabel': 'Tu me plais',
      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/I-like-you/default/small/shutterstock_243960340.jpg'  },

//    { 'targetId':'I-want-you', 'targetUrl':'area/Addressee/recipient/LoveInterestF/intention/F4566D/text/random12FirstTime', 'targetLabel': "J'ai envie de toi",
//      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/I-want-you/default/small/0x550_2.jpg'  },


    { 'targetId':'sorry', 'targetUrl':'area/Addressee/recipient/CloseFriends/intention/70D12F/text/random12FirstTime', 'targetLabel': "Pardon",
      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/sorry/default/small/10411303_606735176104423_5294026815236797770_n.jpg'  },


    { 'targetId':'I-would-like-to-see-you-again',      'targetUrl':'area/Addressee/recipient/LoveInterestF/intention/BD7387/text/random12FirstTime','targetLabel': "J'aimerais vous revoir",
      'imageUrl':'http://az767698.vo.msecnd.net/specialoccasions/I-would-like-to-see-you-again/default/small/542955_245208915590386_1079291617_n.jpg'  },

//    http://gw-static.azurewebsites.net/specialoccasions/I-want-you/default/small/0x550_2.jpg
//    { 'targetId':'I-miss-you', 'targetUrl':'area/Addressee/recipient/SweetheartF/intention/8ED62C/text/random12FirstTime', 'targetLabel': 'Tu me manques',
//      'imageUrl':'http://az767698.vo.msecnd.net/cvd/loveinterest/otherlove/small/shutterstock_32076445.jpg'  },

//    { 'targetId':'facebook-status', 'targetUrl':'area/Addressee/recipient/OtherFriends/intention/2E2986/text/random12FirstTime', 'targetLabel': 'Votre statut facebook',
//      'imageUrl':'http://az767698.vo.msecnd.net/cvd/fbfriend/stockanimals/small/shutterstock_101654053.jpg'  },



    // I-want-you, Je t'aime, Surprends-moi,Quelques mots pour toi, Un peu d'humour
  ];


}]);