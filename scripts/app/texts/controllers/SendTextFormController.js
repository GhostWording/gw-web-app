angular.module('app/texts/SendTextFormController', [])

.controller('SendTextFormController', ['$scope',  '$window','helperSvc', 'currentText','$translate',
function($scope,  $window, helperSvc, currentText,$translate) {

  $scope.currentText = currentText;
  $scope.txt = {
    editableText: currentText.Content
  };

  $translate($scope.theIntentionLabel).then(function(value) {
    $scope.mailToThis = helperSvc.urlMailTo($scope.txt.editableText, value);
    return value;
  });

	$scope.urlMailTo = function () {
    return $scope.mailToThis;
  };

  $scope.sms = function () {
      $window.open(helperSvc.urlSMSTo($scope.txt.editableText), '_blank');
  };

	$scope.canTweet = function () {
		return $scope.editableText && $scope.editableText.length < 141;
	};

	$scope.tweet = function () {
      window.open(helperSvc.urlTweetTo($scope.editableText), '_blank');
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