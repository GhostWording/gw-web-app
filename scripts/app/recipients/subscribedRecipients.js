angular.module('app/recipients/subscribedRecipients', ['common/services/cache'])

.factory('subscribedRecipientsSvc', ['$q','localStorage','recipientTypesSvc', function ($q, localStorage,recipientTypesSvc) {
	var service = {
    nbSubscribedRecipients : 0,

		makeCacheKey : function(recipientId) {
			return 'subscriptionState.' + recipientId;
		},
		getStateForRecipientTypeAlerts: function(recipientId) {
			var retval = localStorage.get(service.makeCacheKey(recipientId));
			return retval;
		},
    countSubscribedRecipients : function() {
      return recipientTypesSvc.getAll().then(function(recipients){
        service.nbSubscribedRecipients  = 0;
        for (var i= 0; i < recipients.length; i++) {
          var recipient = recipients[i];
          var state = service.getStateForRecipientTypeAlerts(recipient.Id);
          if ( state ) {
            service.nbSubscribedRecipients++;
          }
        }
        return service.nbSubscribedRecipients;
      });
    },

		getsubscribedRecipients : function() {
			return recipientTypesSvc.getAll().then(function(recipients){
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
      service.countSubscribedRecipients();
		}
	};
	return service;
}])

.controller('SubscribedRecipientsController', ['$scope', 'recipientTypesSvc', 'subscribedRecipientsSvc','recipientTypeHelperSvc','currentUser',
function ($scope, recipientTypesSvc, subscribedRecipientsSvc,recipientTypeHelperSvc,currentUser) {

  subscribedRecipientsSvc.countSubscribedRecipients();

  $scope.hasSubscribedRecipients = function() {
    return subscribedRecipientsSvc.nbSubscribedRecipients > 0;
  };

  recipientTypesSvc.getAll().then(function (value) {
    var compatibleRecipients = recipientTypeHelperSvc.getCompatibleRecipients(value,currentUser);

    $scope.recipients = compatibleRecipients;
  });
  $scope.switchState = subscribedRecipientsSvc.switchStateForRecipientTypeAlerts;
  $scope.getState = subscribedRecipientsSvc.getStateForRecipientTypeAlerts;


}]);