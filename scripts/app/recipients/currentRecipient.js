angular.module('app/recipients/currentRecipient', [])

.factory('currentRecipientSvc', ['$q', '$route','subscribableRecipientsSvc', function($q, $route,subscribableRecipientsSvc) {

  var service = {

    getCurrentRecipientId: function() {
      return $route.current && $route.current.params.recipientId;
    },

    getCurrentRecipient: function() {
      var currentRecipientId = service.getCurrentRecipientId();
      if ( !currentRecipientId )
        return null;
      return subscribableRecipientsSvc.getRecipients().then(function(subscribableRecipients) {
        if ( subscribableRecipients ) {
          return  subscribableRecipientsSvc.getFromRecipients(subscribableRecipients,currentRecipientId);
        }
      });
    }
  };

  return service;
}]);
