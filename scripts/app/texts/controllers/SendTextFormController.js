angular.module('app/texts/SendTextFormController', [])

.controller('SendTextFormController', ['$scope', '$modalInstance', '$window','HelperSvc', 'currentText','$translate',
function($scope, $modalInstance, $window, HelperSvc, currentText,$translate) {

  $scope.currentText = currentText;
  $scope.txt = {
    editableText: currentText.Content
  };

	$scope.urlMailTo = function () {
//  Probably some case of prototypal bizarrerie : modification to the text from the dialog are discarded if we dont use a proper object to carry the property
    var mailSubject = $scope.currentIntention.Label;
		return HelperSvc.urlMailTo($scope.txt.editableText, mailSubject);
	};

  $translate($scope.currentIntention.Label).then(function(value) {
//    console.log(value);
    $scope.mailToThis = HelperSvc.urlMailTo($scope.txt.editableText, value);
//    console.log($scope.mailToThis);
  });


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