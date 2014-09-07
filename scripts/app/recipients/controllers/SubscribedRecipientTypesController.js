// Chose several recipient types you want to subscribe
angular.module('app/recipients/SubscribedRecipientTypesController', ['common/services/cache'])
.controller('SubscribedRecipientTypesController', ['$scope', 'recipientTypesSvc', 'subscribedRecipientTypesSvc','recipientTypeHelperSvc','currentUser','appUrlSvc',
  function ($scope, recipientTypesSvc, subscribedRecipientTypesSvc,recipientTypeHelperSvc,currentUser,appUrlSvc) {

    $scope.appUrlSvc = appUrlSvc;

    subscribedRecipientTypesSvc.countSubscribedRecipients();

    $scope.hasSubscribedRecipients = function() {
      return subscribedRecipientTypesSvc.nbSubscribedRecipients > 0;
    };

    recipientTypesSvc.getAll().then(function (value) {
      var compatibleRecipients = recipientTypeHelperSvc.getCompatibleRecipients(value,currentUser);

      $scope.recipients = compatibleRecipients;
    });
    $scope.switchState = subscribedRecipientTypesSvc.switchStateForRecipientTypeAlerts;
    $scope.getState = subscribedRecipientTypesSvc.getStateForRecipientTypeAlerts;

    $scope.setSubscriptionState = subscribedRecipientTypesSvc.setStateForRecipientTypeAlerts;
  }]);
