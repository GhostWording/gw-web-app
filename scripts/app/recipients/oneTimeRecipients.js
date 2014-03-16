angular.module('app/recipients/oneTimeRecipients', [])

.controller('OneTimeRecipientsController', ['$scope', 'subscribableRecipientsSvc',
  function ($scope, subscribableRecipientsSvc) {

    subscribableRecipientsSvc.getAll().then(function (value) {
      $scope.recipients = value;
    });

  }]);