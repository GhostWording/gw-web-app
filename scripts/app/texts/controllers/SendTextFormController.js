angular.module('app/texts/SendTextFormController', [])

.controller('SendTextFormController', ['$scope',  '$window','helperSvc', 'currentText','$translate',
function($scope,  $window, helperSvc, currentText,$translate) {

  $scope.currentText = currentText;
  $scope.txt = {
    editableText: currentText.Content
  };

  $translate($scope.currentIntention.Label).then(function(value) {
    $scope.mailToThis = helperSvc.urlMailTo($scope.txt.editableText, value);
    return value;
  });

	$scope.urlMailTo = function () {
//  Probably some case of prototypal bizarrerie : modification to the text from the dialog are discarded if we dont use a proper object to carry the property
    //var retval = helperSvc.urlMailTo($scope.txt.editableText, mailSubject);
    //return retval;
//    $translate($scope.currentIntention.Label).then(function(value) {
//      $scope.mailToThis = helperSvc.urlMailTo($scope.txt.editableText, value);
//    });
//    // Should not really return the up to date value. Kind of does
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