// Chose one recipient type
angular.module('app/recipients/SelecteSingleRecipientTypeController', ['common/areas/areasSvc'])

.controller('SelecteSingleRecipientTypeController', ['$scope','$filter', 'recipientTypesSvc','areasSvc','recipientTypeHelperSvc','currentUser',
  function ($scope, $filter, recipientTypesSvc,areasSvc,recipientTypeHelperSvc,currentUser) {
    // TODO : ordering should be differente from subscribable recipients
    $scope.currentAreaName = areasSvc.getCurrentName();

    recipientTypesSvc.getAll().then(function (value) {
      var compatibleRecipients = recipientTypeHelperSvc.getCompatibleRecipients(value,currentUser);
      $scope.recipients =   $filter('orderBy')(compatibleRecipients, 'Importance');
    });

  }]);