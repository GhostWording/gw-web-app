// People we should communicate with more often !
// This is a static set for now
angular.module('app/recipients', ['common/services/cache'])

.factory('possibleRecipientsSvc', ['$q', function ($q) {
	var service = {
		getAll: function() {
			return $q.when([
				{ "Id": "SweetheartF", "RecipientTypeId": "9E2D23", "Gender": "F", "LocalLabel": "Ma chérie"},
				{ "Id": "SweetheartM", "RecipientTypeId": "9E2D23", "Gender": "M", "LocalLabel": "Mon chéri"},
				{ "Id": "CloseFriends", "RecipientTypeId": "3B9BF2", "Gender": "I", "LocalLabel": "Les copains et les copines"},
				{ "Id": "LongLostFriends", "RecipientTypeId": "2B4F14", "Gender": "I", "LocalLabel": "Les amis perdus de vue"},
				{ "Id": "SiblingsF", "RecipientTypeId": "87F524", "Gender": "F", "LocalLabel": "Ma soeur"},
				{ "Id": "SiblingsM", "RecipientTypeId": "87F524", "Gender": "M", "LocalLabel": "Mon frère"},
				{ "Id": "ParentsF", "RecipientTypeId": "64C63D", "Gender": "F", "LocalLabel": "Maman"},
				{ "Id": "ParentsM", "RecipientTypeId": "64C63D", "Gender": "M", "LocalLabel": "Papa"},
				{ "Id": "DistantRelatives", "RecipientTypeId": "BCA601", "Gender": "I", "LocalLabel": "La famille éloignée"},
				{ "Id": "ProfessionalNetwork", "RecipientTypeId": "35AE93", "Gender": "I", "LocalLabel": "Mon réseau pro"}
			]);
		}
	};
	return service;
}])

.factory('recipientsSvc', ['$q','localStorage','possibleRecipientsSvc', function ($q, localStorage,possibleRecipientsSvc) {
    var service = {
        makeCacheKey : function(recipientId) {
            return 'recipientAlertState.' + recipientId;
        },
        getStateForRecipientTypeAlerts: function(recipientId) {
            // does not seem to work
//            return cacheSvc.get(service.makeCacheKey(recipientTypeId), -1, function() {return false;});
            var retval = localStorage.get(service.makeCacheKey(recipientId));
            return retval;
        },
        getActiveRecipients : function() {
            return possibleRecipientsSvc.getAll().then(function(recipients){
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

.factory('alertSvc', ['$q','localStorage','recipientsSvc', function ($q, localStorage,recipientsSvc) {
    var service = {

        getAllPossibleSubscriptions: function() {
            return $q.when([
                { "RecipientTypeId": "9E2D23", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "FreqNumerator": "1", "FreqPeriod":"jour"}, // Sweetheart => Je pense à toi
                { "RecipientTypeId": "9E2D23", "IntentionId": "F4566D", "IntentionLabel" : "J'ai envie de toi", "FreqNumerator": "1", "FreqPeriod":"semaine" }, // Sweetheart => J'ai envie de toi
                { "RecipientTypeId": "9E2D23", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "3", "FreqPeriod":"semaine"}, // Sweetheart => Merci
                { "RecipientTypeId": "87F524", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "FreqNumerator": "2", "FreqPeriod":"mois"}, // Siblings => Un peu d'humour
                { "RecipientTypeId": "87F524", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "2", "FreqPeriod":"mois"}, // Siblings => Merci
                { "RecipientTypeId": "87F524", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "FreqNumerator": "2", "FreqPeriod":"mois"}, // Siblings => Prenons un verre
                { "RecipientTypeId": "64C63D", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "FreqNumerator": "2", "FreqPeriod":"semaine"}, // Parents  => Je pense à toi
                { "RecipientTypeId": "64C63D", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner",       "FreqNumerator": "1", "FreqPeriod":"mois"},    // Parents
                { "RecipientTypeId": "64C63D", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un café",  "FreqNumerator": "1", "FreqPeriod":"mois"},   // Parents
                { "RecipientTypeId": "64C63D", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "FreqNumerator": "2", "FreqPeriod":"semaine"}, // Parents
                { "RecipientTypeId": "64C63D", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "2", "FreqPeriod":"mois"},    // Parents
                { "RecipientTypeId": "2B4F14", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "FreqNumerator": "2", "FreqPeriod":"mois"},   // LongLostFriends
                { "RecipientTypeId": "3B9BF2", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "2", "FreqPeriod":"mois"},   // CloseFriends
                { "RecipientTypeId": "3B9BF2", "IntentionId": "916FFC", "IntentionLabel" : "Trinquons !",       "FreqNumerator": "2", "FreqPeriod":"mois"},   // CloseFriends
                { "RecipientTypeId": "3B9BF2", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "FreqNumerator": "2", "FreqPeriod":"mois"},   // CloseFriends
                { "RecipientTypeId": "3B9BF2", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "FreqNumerator": "2", "FreqPeriod":"semaine"}, // CloseFriends
                { "RecipientTypeId": "BCA601", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",   "FreqNumerator": "1", "FreqPeriod":"semaine"}, // DistantRelativs
                { "RecipientTypeId": "35AE93", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",   "FreqNumerator": "1", "FreqPeriod":"semaine"}, // ProfessionalNetwork
                { "RecipientTypeId": "35AE93", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",   "FreqNumerator": "1", "FreqPeriod":"semaine"}, // ProfessionalNetwork
            ]);
        },

        addPossibleSubscriptionsToRecipients : function(recipients) {
            return service.getAllPossibleSubscriptions().then(function(subscriptions) {
                // Populate alerts property of each recipient with applicable subscriptions
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
//                return recipientsSvc.getAll().then(
            return recipientsSvc.getActiveRecipients().then(
                function (recipients) {
                    recipients = service.addPossibleSubscriptionsToRecipients(recipients);
                    return recipients;
                }
            );
        }
    };
    return service;
}])

.controller('RecipientListController', ['$scope', 'possibleRecipientsSvc','recipientsSvc',
function ($scope, possibleRecipientsSvc, recipientsSvc) {

	possibleRecipientsSvc.getAll().then(function (value) {
        $scope.lesQui = value;
    });
    $scope.switchState = recipientsSvc.switchStateForRecipientTypeAlerts;
    $scope.getState = recipientsSvc.getStateForRecipientTypeAlerts;

}])

.controller('RecipientAlertsController', ['$scope', 'recipientsSvc','alertSvc',
function ($scope, recipientsSvc,alertSvc) {

    alertSvc.getAllRecipientsWithSubscriptions().then(function (value) {
        $scope.recipientsWithSubscriptions = value;
    });

}]);
