angular.module('app/texts/SendTextFormController', [])

.controller('SendTextFormController', ['$scope', '$modalInstance', '$window', function($scope, $modalInstance, $window) {

  function urlTweetTo(text) {
  }

  function urlSMSTo(text) {
  }

  $scope.sms = function () {
      $window.open(urlSMSTo($scope.editableText), '_blank');
  };

  $scope.canTweet = function() {
    return $scope.editableText && $scope.editableText.length < 141;
  };


  $scope.tweet = function () {
      window.open(urlTweetTo($scope.editableText), '_blank');
  };

  $scope.mail = function () {
  };

  $scope.copy = function () {
  };

  $scope.isIPhone = function () {
    var retval = false;
    if (navigator.userAgent.indexOf('iPhone') != -1)
      retval = true;
    return retval;
  };

}]);