angular.module('app/recipients/oneTimeRecipients', [])

.controller('OneTimeRecipientsController', ['$scope','$filter', 'subscribableRecipientsSvc',
  function ($scope, $filter, subscribableRecipientsSvc) {

    // TODO : ordering should be differente from subscribable recipients

    subscribableRecipientsSvc.getAll().then(function (value) {
      $scope.recipients =   $filter('orderBy')(value, 'Importance');
    });

  }]);