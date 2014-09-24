//angular.module('app/users/subscriptions',['app/recipients'])
angular.module('app/users/subscriptions',[])

.factory('subscriptionsSvc', ['$q','subscribedRecipientTypesSvc','likelyIntentionsSvc','$rootScope','localStorage',
	function ($q, subscribedRecipientTypesSvc,likelyIntentionsSvc,$rootScope,localStorage) {
		var service = {
      // An array of subscribed recipients to which subscribed intentions are attached
      _subscribedRecipients : [],

      // We remember if user wants to desactivate subscription to and intention for a given recipient
      makeSubscriptionKey : function(recipientId, intentionId) {
        return 'DesactivateSubscription.'+recipientId +'.' + intentionId;
      },
      makeNewSubscriptionKey : function(recipientId, intentionId) {
        return 'HasSubscription.'+recipientId +'.' + intentionId;
      },
      // Storage remembers when user does NOT want to subscribe. If nothing is found, we initialize with true
      getStateFromStorage : function(recipientId, intentionId) {
//        var disactivationWanted = localStorage.get(service.makeSubscriptionKey(recipientId, intentionId));
//        var retval = disactivationWanted ? false : true;
        var activationWanted = localStorage.get(service.makeNewSubscriptionKey(recipientId, intentionId));
        console.log("activationWanted : " + activationWanted);
        return activationWanted;
      },
      setStateInStorage : function(recipientId, intentionId,subscription) {
//        var key = service.makeSubscriptionKey(recipientId, intentionId);
//        localStorage.set(key,!subscription.IsActive);
        var key = service.makeNewSubscriptionKey(recipientId, intentionId);
        localStorage.set(key,subscription.IsActive);
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
        service.setStateInStorage(recipientId, intentionId,subscription);
      },
      setState : function(recipientId, intentionId,value) {
        var subscription = service.getSubscription(recipientId, intentionId);
        if (subscription)
          subscription.IsActive = value;
        service.setStateInStorage(recipientId, intentionId,subscription);
      },
      // TODO : we should add get and set to read and update the required frequency for a recipient/intention subscription
      // Extract subscription line for a given recipient/intention
      getSubscription : function(recipientId, intentionId) {
        if ( !service._subscribedRecipients )
          return null;
        for (var i = service._subscribedRecipients.length - 1; i >= 0; i--) {
          var recipient = service._subscribedRecipients[i];
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
        if ( !service._subscribedRecipients )
          return null;
        for (var i = service._subscribedRecipients.length - 1; i >= 0; i--) {
          var recipient = service._subscribedRecipients[i];
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
            var recipientTypeTag = recipient.RecipientTypeTag;
            var recipientId = recipient.Id;
            // Add what we already have if we have something
            var subscribedRecipient = service.getSubscribedRecipient(recipientTypeTag);
            if (subscribedRecipient) {
              recipientsWithSubscriptions.push(subscribedRecipient);
            } else {
              // Else add default subscriptions (possibleSubscriptions given by the server)
              recipientsWithSubscriptions.push(recipient);
              recipient.alerts = [];
              for (var j = 0; j < possibleSubscriptions.length; j++) {
                var possibleSubscription = possibleSubscriptions[j];
                if (possibleSubscription.RecipientTypeTag == recipientTypeTag) {
                  var alert = angular.copy(possibleSubscription);
                  // Check if user previously said he wants to subscribe to this intention for this recipient
                  alert.IsActive = service.getStateFromStorage(recipientId, possibleSubscription.IntentionId);
                  if ( alert.IsActive === null  )
                    alert.IsActive = alert.default;
                  recipient.alerts.push(alert);
                }
              }
            }
          }
          service._subscribedRecipients = subscribedRecipients;
          return subscribedRecipients;
        });
      },
      getRecipientsWithSubscriptions: function () {
        return subscribedRecipientTypesSvc.getsubscribedRecipients()
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
;
