angular.module('app/recipients/subscribedRecipients', ['common/services/cache'])

.factory('subscribedRecipientsSvc', ['$q','localStorage','subscribableRecipientsSvc', function ($q, localStorage,subscribableRecipientsSvc) {
	var service = {
		makeCacheKey : function(recipientId) {
			return 'subscriptionState.' + recipientId;
		},
		getStateForRecipientTypeAlerts: function(recipientId) {
			var retval = localStorage.get(service.makeCacheKey(recipientId));
			return retval;
		},
		getsubscribedRecipients : function() {
			return subscribableRecipientsSvc.getAll().then(function(recipients){
				var retval = [];
				for (var i= 0; i < recipients.length; i++) {
					var recipient = recipients[i];
					var state = service.getStateForRecipientTypeAlerts(recipient.Id);
					if ( state ) {
						retval.push(recipient);
					}
				}
				return retval;
			});
		},
		switchStateForRecipientTypeAlerts: function(recipientId) {
			var currentState = service.getStateForRecipientTypeAlerts(recipientId);
			var newState = !currentState;
			localStorage.set(service.makeCacheKey(recipientId),newState);
		}
	};
	return service;
}])
.controller('SubscribableRecipientsController', ['$scope', 'subscribableRecipientsSvc', 'subscribedRecipientsSvc',
function ($scope, subscribableRecipientsSvc, subscribedRecipientsSvc) {

  subscribableRecipientsSvc.getAll().then(function (value) {
    $scope.recipients = value;
  });
  $scope.switchState = subscribedRecipientsSvc.switchStateForRecipientTypeAlerts;
  $scope.getState = subscribedRecipientsSvc.getStateForRecipientTypeAlerts;

}]);