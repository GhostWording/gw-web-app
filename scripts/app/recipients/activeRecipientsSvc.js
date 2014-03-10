angular.module('app/recipients/activeRecipientsSvc', ['common/services/cache'])

.factory('activeRecipientsSvc', ['$q','localStorage','subscribableRecipientsSvc', function ($q, localStorage,subscribableRecipientsSvc) {
	var service = {
		makeCacheKey : function(recipientId) {
			return 'recipientAlertState.' + recipientId;
		},
		getStateForRecipientTypeAlerts: function(recipientId) {
			var retval = localStorage.get(service.makeCacheKey(recipientId));
			return retval;
		},
		getActiveRecipients : function() {
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
			}
			);
		},
		switchStateForRecipientTypeAlerts: function(recipientId) {
			var currentState = service.getStateForRecipientTypeAlerts(recipientId);
			var newState = !currentState;
			localStorage.set(service.makeCacheKey(recipientId),newState);
		}
	};
	return service;
}])
