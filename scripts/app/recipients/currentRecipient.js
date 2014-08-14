angular.module('app/recipients/currentRecipient', [])

.factory('currentRecipientSvc', ['$q', '$stateChange', 'recipientTypesSvc',
      function($q, $stateChange, recipientTypesSvc) {

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
      return recipientTypesSvc.getRecipients().then(function(recipientTypes) {
        if ( !currentRecipientId || currentRecipientId == service.nullRecipientId)
          return null;
        if ( recipientTypes ) {
          return  recipientTypesSvc.getFromRecipients(recipientTypes,currentRecipientId);
        } else
          return null;
      });
    },

    getCurrentRecipientNow: function() {
      return recipientTypesSvc.getThisOneNow(service.getCurrentRecipientId());
    }
  };

  return service;
}]);
