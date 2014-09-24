angular.module('app/subscriptions/SubscriptionController',['app/recipients'])

.controller('SubscriptionController', ['$scope', 'subscribedRecipientTypesSvc', 'subscriptionsSvc','serverSvc','currentUserLocalData','deviceIdSvc','recipientTypeHelperSvc','currentUser',
  function ($scope, subscribedRecipientTypesSvc, subscriptionsSvc,serverSvc,currentUserLocalData,deviceIdSvc,recipientTypeHelperSvc,currentUser) {

    $scope.userHasModifiedSubscription = false;

    $scope.subscriptionModified = function() {
      $scope.userHasModifiedSubscription = true;
    };

    subscriptionsSvc.getRecipientsWithSubscriptions().then(function (value) {
      //var compatibleRecipients = recipientTypeHelperSvc.getCompatibleRecipients(value,currentUser);
      $scope.recipientsWithSubscriptions = value;
    });

    $scope.sendSubscriptionsToServer = function () {
      serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUserLocalData.subcriptions);
    };

    $scope.getSubscriptionState = subscriptionsSvc.getState;

    $scope.switchSubscriptionState = subscriptionsSvc.switchState;

    $scope.setSubscriptionState = subscriptionsSvc.setState;

  }]);
