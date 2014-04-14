angular.module('app/recipients/currentRecipient', [])

.factory('currentRecipientSvc', ['$q', '$route','subscribableRecipientsSvc', function($q, $route,subscribableRecipientsSvc) {

  var service = {

    nullRecipientId: 'none',

    getCurrentRecipientId: function() {
      var retval = $route.current && $route.current.params.recipientId;
      if ( !retval )
        retval = service.nullRecipientId;
      return retval;
    },

    getIdOfRecipient: function(recipient) {
      var valret = recipient ? recipient.Id :  service.nullRecipientId;
      return valret;
    },

    getCurrentRecipient: function() {
      var currentRecipientId = service.getCurrentRecipientId();
      return subscribableRecipientsSvc.getRecipients().then(function(subscribableRecipients) {
        if ( !currentRecipientId || currentRecipientId == service.nullRecipientId)
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