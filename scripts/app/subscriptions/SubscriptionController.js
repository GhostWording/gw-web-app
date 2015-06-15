angular.module('app/subscriptions/SubscriptionController',['common/recipients','common/services/postActionSvc'])

.controller('SubscriptionController', ['$scope', 'subscriptionsSvc','serverSvc','currentUserLocalData','deviceIdSvc','postActionSvc',
  function ($scope, subscriptionsSvc,serverSvc,currentUserLocalData,deviceIdSvc,postActionSvc) {

    postActionSvc.postActionInfo('Init','Page','Subscriptions','Init');


    $scope.userHasModifiedSubscription = false;

    $scope.subscriptionModified = function() {
      $scope.userHasModifiedSubscription = true;
    };

    subscriptionsSvc.getRecipientsWithSubscriptions().then(function (value) {
      $scope.recipientsWithSubscriptions = value;
    });

    $scope.sendSubscriptionsToServer = function () {
      //serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUserLocalData.subcriptions);
      serverSvc.postUserSubscriptions(deviceIdSvc.get(), currentUserLocalData.subcriptions);
    };

    $scope.getSubscriptionState = subscriptionsSvc.getState;

    $scope.switchSubscriptionState = subscriptionsSvc.switchState;

    $scope.setSubscriptionState = subscriptionsSvc.setState;

  }]);
