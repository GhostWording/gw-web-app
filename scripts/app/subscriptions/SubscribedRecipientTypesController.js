// Chose several recipient types you want to subscribe
angular.module('app/subscriptions/SubscribedRecipientTypesController', ['common/services/cache','common/recipients'])
.controller('SubscribedRecipientTypesController', ['$scope', 'recipientTypesSvc', 'subscribedRecipientTypesSvc','recipientTypeHelperSvc','currentUser','appUrlSvc','areasSvc','facebookSvc',
  function ($scope, recipientTypesSvc, subscribedRecipientTypesSvc,recipientTypeHelperSvc,currentUser,appUrlSvc,areasSvc,facebookSvc) {

    areasSvc.setCurrentName('cvdWeb');

    $scope.currentUser = currentUser;
    $scope.appUrlSvc = appUrlSvc;

    $scope.isConnectedToFacebook = facebookSvc.isConnected();

    $scope.$watch(function() { return facebookSvc.isConnected();},function() {
      //console.log("facebookSvc.isConnected() : " +facebookSvc.isConnected() )
      $scope.isConnectedToFacebook = facebookSvc.isConnected();
    },true);

    $scope.login = facebookSvc.fbLogin;
    $scope.connectToFacebook = facebookSvc.fbLogin;

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
