angular.module('app/users/SubscriptionController',['app/recipients'])

.controller('SubscriptionController', ['$scope', 'subscribedRecipientsSvc', 'subscriptionsSvc','serverSvc','currentUserLocalData','deviceIdSvc','recipientTypeHelperSvc','currentUser',
  function ($scope, subscribedRecipientsSvc, subscriptionsSvc,serverSvc,currentUserLocalData,deviceIdSvc,recipientTypeHelperSvc,currentUser) {

    subscriptionsSvc.getRecipientsWithSubscriptions().then(function (value) {
      //var compatibleRecipients = recipientTypeHelperSvc.getCompatibleRecipients(value,currentUser);
      $scope.recipientsWithSubscriptions = value;
    });

    $scope.sendSubscriptionsToServer = function () {
      serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUserLocalData.subcriptions);
    };

    $scope.getSubscriptionState = subscriptionsSvc.getState;

    $scope.switchSubscriptionState = subscriptionsSvc.switchState;

  }]);
