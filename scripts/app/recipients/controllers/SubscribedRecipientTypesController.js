// Chose several recipient types you want to subscribe
angular.module('app/recipients/SubscribedRecipientTypesController', ['common/services/cache'])
.controller('SubscribedRecipientTypesController', ['$scope', 'recipientTypesSvc', 'subscribedRecipientTypesSvc','recipientTypeHelperSvc','currentUser','appUrlSvc',
  function ($scope, recipientTypesSvc, subscribedRecipientTypesSvc,recipientTypeHelperSvc,currentUser,appUrlSvc) {

    $scope.currentUser = currentUser;

    $scope.appUrlSvc = appUrlSvc;

    subscribedRecipientTypesSvc.countSubscribedRecipients();

    $scope.hasSubscribedRecipients = function() {
      return subscribedRecipientTypesSvc.nbSubscribedRecipients > 0;
    };

    var allRecipients;
    recipientTypesSvc.getAll().then(function (value) {
      allRecipients = value;
      var compatibleRecipients = recipientTypeHelperSvc.getCompatibleRecipients(allRecipients,currentUser);
      $scope.recipients = compatibleRecipients;
    });

    $scope.$watch(function() {return currentUser;},
    function() {
      if ( !!allRecipients ) {
        $scope.recipients = recipientTypeHelperSvc.getCompatibleRecipients(allRecipients,currentUser);
      }
    },true);

    $scope.switchState = subscribedRecipientTypesSvc.switchStateForRecipientTypeAlerts;
    $scope.getState = subscribedRecipientTypesSvc.getStateForRecipientTypeAlerts;

    $scope.setSubscriptionState = subscribedRecipientTypesSvc.setStateForRecipientTypeAlerts;
  }]);
