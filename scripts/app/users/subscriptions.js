angular.module('app/users/subscriptions',['app/recipients'])

.factory('subscriptionsSvc', ['$q','activeRecipientsSvc','subscribableIntentionsSvc','$rootScope',
	function ($q, activeRecipientsSvc,subscribableIntentionsSvc,$rootScope) {
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
				return activeRecipientsSvc.getActiveRecipients()
				.then(function (recipients) {
					return service.addPossibleSubscriptionsToRecipients(recipients);
				})
				.then(function (subscriptions) {
          $rootScope.$broadcast('users.subcriptionChange',subscriptions);
					return subscriptions;
				});
			}


		};
		return service;
	}])

.controller('RecipientListController', ['$scope', 'subscribableRecipientsSvc', 'activeRecipientsSvc',
	function ($scope, subscribableRecipientsSvc, activeRecipientsSvc) {

		subscribableRecipientsSvc.getAll().then(function (value) {
			$scope.lesQui = value;
		});
		$scope.switchState = activeRecipientsSvc.switchStateForRecipientTypeAlerts;
		$scope.getState = activeRecipientsSvc.getStateForRecipientTypeAlerts;

	}])

.controller('SubscriptionController', ['$scope', 'activeRecipientsSvc', 'subscriptionsSvc','serverSvc','currentUserLocalData','deviceIdSvc',
	function ($scope, activeRecipientsSvc, subscriptionsSvc,serverSvc,currentUserLocalData,deviceIdSvc) {

		subscriptionsSvc.getAllRecipientsWithSubscriptions().then(function (value) {
			$scope.recipientsWithSubscriptions = value;
		});

		$scope.sendSubscriptionsToServer = function () {
			serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUserLocalData.subcriptions);
		};

	}]);
