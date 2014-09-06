angular.module('app/recipients/subscribedRecipientTypes', ['common/services/cache'])

.factory('subscribedRecipientTypesSvc', ['$q','localStorage','recipientTypesSvc', function ($q, localStorage,recipientTypesSvc) {
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
		},
    setStateForRecipientTypeAlerts: function(recipientId,value) {
      localStorage.set(service.makeCacheKey(recipientId),value);
      service.countSubscribedRecipients();
    }

	};
	return service;
}])

.controller('SubscribedRecipientsController', ['$scope', 'recipientTypesSvc', 'subscribedRecipientTypesSvc','recipientTypeHelperSvc','currentUser','appUrlSvc',
function ($scope, recipientTypesSvc, subscribedRecipientTypesSvc,recipientTypeHelperSvc,currentUser,appUrlSvc) {

  $scope.appUrlSvc = appUrlSvc;

  subscribedRecipientTypesSvc.countSubscribedRecipients();

  $scope.hasSubscribedRecipients = function() {
    return subscribedRecipientTypesSvc.nbSubscribedRecipients > 0;
  };

  recipientTypesSvc.getAll().then(function (value) {
    var compatibleRecipients = recipientTypeHelperSvc.getCompatibleRecipients(value,currentUser);

    $scope.recipients = compatibleRecipients;
  });
  $scope.switchState = subscribedRecipientTypesSvc.switchStateForRecipientTypeAlerts;
  $scope.getState = subscribedRecipientTypesSvc.getStateForRecipientTypeAlerts;

  $scope.setSubscriptionState = subscribedRecipientTypesSvc.setStateForRecipientTypeAlerts;

}]);