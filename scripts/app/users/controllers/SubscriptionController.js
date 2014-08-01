angular.module('app/users/SubscriptionController',['app/recipients'])

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
