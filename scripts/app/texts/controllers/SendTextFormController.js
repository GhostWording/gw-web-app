angular.module('app/texts/SendTextFormController', [])

.controller('SendTextFormController', ['$scope', '$modalInstance', '$window','HelperSvc',
function($scope, $modalInstance, $window,HelperSvc) {

	$scope.urlMailTo = function () {
//  Probably some case of prototypal bizarrerie : modification to the text from the dialog are discarded if we dont use a proper object to carry the property
//	return HelperSvc.urlMailTo($scope.editableText, $scope.currentIntention.Label);
		return HelperSvc.urlMailTo($scope.txt.editableText, $scope.currentIntention.Label);
	};

  $scope.sms = function () {
      $window.open(HelperSvc.urlSMSTo($scope.txt.editableText), '_blank');
  };

	$scope.canTweet = function () {
		return $scope.editableText && $scope.editableText.length < 141;
	};

	$scope.tweet = function () {
      window.open(HelperSvc.urlTweetTo($scope.editableText), '_blank');
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