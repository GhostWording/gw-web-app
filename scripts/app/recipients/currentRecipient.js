angular.module('app/recipients/currentRecipient', [])

.factory('currentRecipientSvc', ['$q', '$route','subscribableRecipientsSvc', function($q, $route,subscribableRecipientsSvc) {

  var service = {

    getCurrentRecipientId: function() {
      return $route.current && $route.current.params.recipientId;
    },
    getBlankValue: function() {
      return '';
    },

    getCurrentRecipient: function() {
      var currentRecipientId = service.getCurrentRecipientId();
      return subscribableRecipientsSvc.getRecipients().then(function(subscribableRecipients) {
        if ( !currentRecipientId )
          return null;
        if ( subscribableRecipients ) {
          return  subscribableRecipientsSvc.getFromRecipients(subscribableRecipients,currentRecipientId);
        } else
          return null;
      });
    }
  };

  return service;
}]);
