// Display general information about our App
angular.module('app/splash', ['common/services'])

.controller('SplashScreenController', ['$scope','currentLanguage', 'myfb',function ($scope,currentLanguage,myfb) {

  $scope.isFrench = currentLanguage.isFrenchVersion();

//  $facebook.getLoginStatus().then(function(response) {
//    console.log(response);
//    FB.XFBML.parse(); // fb sdk must be initialised before FB can be mentionned
//  } );

  // Does not work : FB not initialized
//  if ($facebook.isConnected && !!FB)
//    FB.XFBML.parse(); // fb sdk must be initialised before FB can be mentionned


}]);