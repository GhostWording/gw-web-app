// People we should communicate with more often !
// This is a static set for now
angular.module('app/recipients/recipients', ['common/services/cache'])

.factory('subscriptionsSvc', ['$q','localStorage','activeRecipientsSvc','subscribableIntentionsSvc', function ($q, localStorage,activeRecipientsSvc,subscribableIntentionsSvc) {
    var service = {
        addPossibleSubscriptionsToRecipients : function(recipients) {
            return subscribableIntentionsSvc.getAllPossibleSubscriptions().then(function(subscriptions) {
                // Populate alerts property of each recipient with applicable subscriptions : intention
                for (var i = recipients.length-1; i >=0 ; i--) {
                    var recipient = recipients[i];
                    var recipientTypeId = recipient.RecipientTypeId;
                    recipient.alerts = [];
                    for ( var j = 0; j < subscriptions.length; j++ ) {
                        var subscription = subscriptions[j];
                        if ( subscription.RecipientTypeId == recipientTypeId ) {
                            var alert = angular.copy(subscription);
                            recipient.alerts.push(alert);
                        }
                    }
                }
                return recipients;
            });
        },

        // What we might want to do
        // 1 - Get a list of possible recipient from the server
        // 2 - For each possible recipient,
        //      - look at subscriptions (intentions that can be subscribed to with a given frequency) from the server
        //      - check in local storage if we allread have values for them
        //      - use default values from the server if we can't read them from local storage
        // What we are doing :
        getAllRecipientsWithSubscriptions: function () {
//                return activeRecipientsSvc.getAll().then(
            return activeRecipientsSvc.getActiveRecipients().then(
                function (recipients) {
                    recipients = service.addPossibleSubscriptionsToRecipients(recipients);
                    return recipients;
                }
            );
        }
    };
    return service;
}])

.controller('RecipientListController', ['$scope', 'subscribableRecipientsSvc','activeRecipientsSvc',
function ($scope, subscribableRecipientsSvc, activeRecipientsSvc) {

	subscribableRecipientsSvc.getAll().then(function (value) {
        $scope.lesQui = value;
    });
    $scope.switchState = activeRecipientsSvc.switchStateForRecipientTypeAlerts;
    $scope.getState = activeRecipientsSvc.getStateForRecipientTypeAlerts;

}])

.controller('RecipientAlertsController', ['$scope', 'activeRecipientsSvc','subscriptionsSvc',
function ($scope, activeRecipientsSvc,subscriptionsSvc) {

    subscriptionsSvc.getAllRecipientsWithSubscriptions().then(function (value) {
        $scope.recipientsWithSubscriptions = value;
    });

}]);
