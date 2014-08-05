angular.module('app/users/SubscriptionController',['app/recipients'])

.controller('SubscriptionController', ['$scope', 'subscribedRecipientsSvc', 'subscriptionsSvc','serverSvc','currentUserLocalData','deviceIdSvc','recipientsHelperSvc','currentUser',
  function ($scope, subscribedRecipientsSvc, subscriptionsSvc,serverSvc,currentUserLocalData,deviceIdSvc,recipientsHelperSvc,currentUser) {

    subscriptionsSvc.getRecipientsWithSubscriptions().then(function (value) {
      var compatibleRecipients = recipientsHelperSvc.getCompatibleRecipients(value,currentUser);
      $scope.recipientsWithSubscriptions = compatibleRecipients;
    });

    $scope.sendSubscriptionsToServer = function () {
      serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUserLocalData.subcriptions);
    };

    $scope.getSubscriptionState = subscriptionsSvc.getState;

    $scope.switchSubscriptionState = subscriptionsSvc.switchState;

  }]);
