angular.module('app/recipients/oneTimeRecipients', ['app/areas'])

.controller('UsualRecipientsController', ['$scope','$filter', 'subscribableRecipientsSvc','areasSvc','recipientsHelperSvc','currentUser',
  function ($scope, $filter, subscribableRecipientsSvc,areasSvc,recipientsHelperSvc,currentUser) {
    // TODO : ordering should be differente from subscribable recipients
    $scope.currentAreaName = areasSvc.getCurrentName();

    subscribableRecipientsSvc.getAll().then(function (value) {
      var compatibleRecipients = recipientsHelperSvc.getCompatibleRecipients(value,currentUser);
      $scope.recipients =   $filter('orderBy')(compatibleRecipients, 'Importance');
    });

  }]);