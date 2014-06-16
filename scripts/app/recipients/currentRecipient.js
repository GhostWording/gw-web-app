angular.module('app/recipients/currentRecipient', [])

.factory('currentRecipientSvc', ['$q', '$stateChange', 'subscribableRecipientsSvc',
      function($q, $stateChange, subscribableRecipientsSvc) {

  var service = {

    nullRecipientId: 'none',

    getCurrentRecipientId: function() {
      var retval = $stateChange.toParams.recipientId;
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
    },

    getCurrentRecipientNow: function() {
      return subscribableRecipientsSvc.getThisOneNow(service.getCurrentRecipientId());
    }
  };

  return service;
}]);
