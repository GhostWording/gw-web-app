angular.module('app/users/subscriptions',['app/recipients'])

.factory('subscriptionsSvc', ['$q','subscribedRecipientsSvc','likelyIntentionsSvc','$rootScope','localStorage',
	function ($q, subscribedRecipientsSvc,likelyIntentionsSvc,$rootScope,localStorage) {
		var service = {
      // An array of subscribed recipients to which subscribed intentions are attached
      subscribedRecipients : [],

      // We remember if user wants to desactivate subscription to and intention for a given recipient
      makeSubscriptionKey : function(recipientId, intentionId) {
        return 'DesactivateSubscription.'+recipientId +'.' + intentionId;
      },
      // Storage remembers when user does NOT want to subscribe. If nothing is found, we initialize with true
      getStateFromStorage : function(recipientId, intentionId) {
        var disactivationWanted = localStorage.get(service.makeSubscriptionKey(recipientId, intentionId));
        var retval = disactivationWanted ? false : true;
        return retval;
      },
      setStateFromStorage : function(recipientId, intentionId,subscription) {
        var key = service.makeSubscriptionKey(recipientId, intentionId);
        localStorage.set(key,!subscription.IsActive);
      },
      // Read state from actual subscriptions
      getState : function(recipientId, intentionId) {
        var subscription = service.getSubscription(recipientId, intentionId);
        return subscription.IsActive;
      },
      // Update state of actual subscriptions and memorize in local storage
      switchState : function(recipientId, intentionId) {
        var subscription = service.getSubscription(recipientId, intentionId);
        if (subscription)
          subscription.IsActive = !subscription.IsActive;
        service.setStateFromStorage(recipientId, intentionId,subscription);
      },
      // TODO : we should add get and set to read and update the required frequency for a recipient/intention subscription
      // ...........
      // Extract subscription line for a given recipient/intention
      getSubscription : function(recipientId, intentionId) {
        if ( !service.subscribedRecipients )
          return null;
        for (var i = service.subscribedRecipients.length - 1; i >= 0; i--) {
          var recipient = service.subscribedRecipients[i];
          if ( recipient.Id == recipientId) {
            for (var j = recipient.alerts.length-1; j >= 0; j--) {
              var subscription = recipient.alerts[j];
              if (subscription.IntentionId == intentionId)
                return subscription;
            }
          }
        }
        return null;
      },
      // Find a subscribed recipient
      getSubscribedRecipient : function(recipientId) {
        if ( !service.subscribedRecipients )
          return null;
        for (var i = service.subscribedRecipients.length - 1; i >= 0; i--) {
          var recipient = service.subscribedRecipients[i];
          if ( recipient.Id == recipientId) {
            return recipient;
          }
        }
        return null;
      },
      //  For each possible recipient ( = server says it can be subscribed and user has selected it)
      //  - check if we already have data for it in our subscriptions
      //  - else use default subscriptions for this recipient (typically provided by the server)
      mergePossibleRecipientsWithPreviousSubscribedRecipients: function (subscribedRecipients) {
        return likelyIntentionsSvc.getIntentionsThatCanBeSubscribedForRecipients().then(function (possibleSubscriptions) {
          var recipientsWithSubscriptions = [];
          // For each active recipient, populate alerts with applicable intention subscriptions
          for (var i = subscribedRecipients.length - 1; i >= 0; i--) {
            var recipient = subscribedRecipients[i];
            var recipientTypeId = recipient.RecipientTypeId;
            var recipientId = recipient.Id;
            // Add what we already have if we have something
            var subscribedRecipient = service.getSubscribedRecipient(recipientTypeId);
            if (subscribedRecipient) {
              recipientsWithSubscriptions.push(subscribedRecipient);
            } else {
              // Else add default subscriptions (possibleSubscriptions given by the server)
              recipientsWithSubscriptions.push(recipient);
              recipient.alerts = [];
              for (var j = 0; j < possibleSubscriptions.length; j++) {
                var possibleSubscription = possibleSubscriptions[j];
                if (possibleSubscription.RecipientTypeId == recipientTypeId) {
                  var alert = angular.copy(possibleSubscription);
                  // Check if user previously said he wants to subscribe to this intention for this recipient
                  alert.IsActive = service.getStateFromStorage(recipientId, possibleSubscription.IntentionId);
                  recipient.alerts.push(alert);
                }
              }
            }
          }
          service.subscribedRecipients = subscribedRecipients;
          return subscribedRecipients;
        });
      },
      getRecipientsWithSubscriptions: function () {
        return subscribedRecipientsSvc.getsubscribedRecipients()
        .then(function (subscribedRecipients) {
          return service.mergePossibleRecipientsWithPreviousSubscribedRecipients(subscribedRecipients);
        })
        .then(function (subscriptions) {
          $rootScope.$broadcast('users.subcriptionChange', subscriptions);
          return subscriptions;
        });
      }
		};
		return service;
	}])

.controller('SubscriptionController', ['$scope', 'subscribedRecipientsSvc', 'subscriptionsSvc','serverSvc','currentUserLocalData','deviceIdSvc',
	function ($scope, subscribedRecipientsSvc, subscriptionsSvc,serverSvc,currentUserLocalData,deviceIdSvc) {

		subscriptionsSvc.getRecipientsWithSubscriptions().then(function (value) {
			$scope.recipientsWithSubscriptions = value;
		});

		$scope.sendSubscriptionsToServer = function () {
			serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUserLocalData.subcriptions);
		};

    $scope.getSubscriptionState = subscriptionsSvc.getState;

    $scope.switchSubscriptionState = subscriptionsSvc.switchState;

  }]);
