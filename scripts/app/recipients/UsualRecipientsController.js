angular.module('app/recipients/oneTimeRecipients', ['app/areas'])

.controller('UsualRecipientsController', ['$scope','$filter', 'subscribableRecipientsSvc','areasSvc',
  function ($scope, $filter, subscribableRecipientsSvc,areasSvc) {
    // TODO : ordering should be differente from subscribable recipients
    $scope.currentAreaName = areasSvc.getCurrentName();

    subscribableRecipientsSvc.getAll().then(function (value) {
      $scope.recipients =   $filter('orderBy')(value, 'Importance');
    });

  }]);