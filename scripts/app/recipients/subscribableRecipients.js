angular.module('app/recipients/subscribableRecipients', [])


.factory('recipientsHelperSvc', [ function () {

  function recipientIsCompatibleWithCurrentUser(recipient,currentUser) {
    var valret = true;
    if ( currentUser.gender == 'H' && "SweetheartM" == recipient.Id )
      valret = false;
    if ( currentUser.gender == 'H' && "LoveInterestM" == recipient.Id )
      valret = false;
    if ( currentUser.gender == 'F' && "SweetheartF" == recipient.Id )
      valret = false;
    if ( currentUser.gender == 'F' && "LoveInterestF" == recipient.Id )
      valret = false;
    return valret;
  }

  var service = {
    getCompatibleRecipients: function (recipients, currentUser) {
      var retval = [];
      for (var i = 0; i < recipients.length; i++ ) {
        var recipient = recipients[i];
        if ( recipientIsCompatibleWithCurrentUser(recipient,currentUser) === false )
          continue;
        retval.push(recipient);
      }
      return retval;
    }
  };
  return service;
}])


// http://en.wikipedia.org/wiki/Mother
//Mom and mommy are used in the United States, Canada, South Africa, Philippines, India and parts of the West Midlands including Birmingham in the United Kingdom.
//Mum and mummy are used in the United Kingdom, Canada, Singapore, Australia, New Zealand, India, Pakistan, Hong Kong and Ireland. Charles, Prince of Wales publicly addressed his mother Queen Elizabeth II as "Mummy" on the occasion of her Diamond Jubilee.[37]
//Ma, mam, and mammy are used in Netherlands, Ireland, the Northern areas of the United Kingdom, and Wales; it is also used in some areas of the United States.
.factory('subscribableRecipientsSvc', ['$q','cacheSvc', function ($q,cacheSvc) {

  var _recipients;

  var service = {
    // Will be read from server in the future

    // TODO : add a property to know if they are compatible with sender gender, recipient gender, recipient context, sender / recipient age difference
    // TODO : add a property to know if they are compatible with target fbFriend properties
    // TODO : if only one in list, don't aks question

    getAll: function() {
			return $q.when([
				{ "Id": "SweetheartF",    "RecipientTypeId": "9E2D23", "Gender": "F", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Ma chérie", "LocalLabel": "Votre chérie", "TuOuVous" : "T", "Importance" : 1},
				{ "Id": "SweetheartM",    "RecipientTypeId": "9E2D23", "Gender": "H", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Mon chéri", "LocalLabel": "Votre chéri", "TuOuVous" : "T", "Importance" : 2},
        { "Id": "CloseFriends",   "RecipientTypeId": "3B9BF2", "Gender": null,usualRecipient : true, subscribableRecipient : true, "dashLabel": "Ami(e) proche", "LocalLabel": "Vos copains et copines", "TuOuVous" : "T","Importance" : 2.5},
        { "Id": "Mother",         "RecipientTypeId": "64C63D", "Gender": "F", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Maman", "LocalLabel": "Votre maman", "TuOuVous" : "T","Importance" : 2.7},
        { "Id": "Father",         "RecipientTypeId": "64C63D", "Gender": "H", usualRecipient : false,subscribableRecipient : false,"dashLabel": "Papa", "LocalLabel": "Votre papa", "TuOuVous" : "T","Importance" : 2.8},
        { "Id": "LoveInterestF",  "RecipientTypeId": "47B7E9", "Gender": "F", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Elle me plaît","LocalLabel": "La femme que j'aime", "TuOuVous" : "T", "Importance" : 3},
        { "Id": "LoveInterestM",  "RecipientTypeId": "47B7E9", "Gender": "H", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Il me plaît","LocalLabel": "L'homme que j'aime", "TuOuVous" : "T", "Importance" : 3},
        { "Id": "LongLostFriends","RecipientTypeId": "2B4F14", "Gender": null,usualRecipient : true, subscribableRecipient : true, "dashLabel": "Perdu(e) de vue","LocalLabel": "Vos amis perdus de vue", "TuOuVous" : "T","Importance" : 4 },
				{ "Id": "Sister",         "RecipientTypeId": "87F524", "Gender": "F", usualRecipient : false,subscribableRecipient : false,"dashLabel": "Soeur","LocalLabel": "Votre soeur", "TuOuVous" : "T","Importance" : 7},
				{ "Id": "Brother",        "RecipientTypeId": "87F524", "Gender": "H", usualRecipient : false,subscribableRecipient : false,"dashLabel": "Frère","LocalLabel": "Votre frère", "TuOuVous" : "T","Importance" : 8},
        { "Id": "ProNetwork",     "RecipientTypeId": "35AE93", "Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Boulot","LocalLabel": "Votre réseau pro", "TuOuVous" : null,"Importance" : 5},
				{ "Id": "DistantRelatives","RecipientTypeId": "BCA601","Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Famille éloignée", "LocalLabel": "La famille éloignée", "TuOuVous" : "T","Importance" : 11},
        { "Id": "OtherFriends",    "RecipientTypeId": null,    "Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Amis divers", "LocalLabel": "Vos autres amis", "TuOuVous" : "T","Importance" : 10},
        { "Id": "OtherFamilly",    "RecipientTypeId": null,    "Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Famille divers", "LocalLabel": "Famille autre", "TuOuVous" : "T","Importance" : 10}
			]);
		},

    getRecipients: function() {
      //console.log("getRecipients called");
      // skip local storage until we have a way to invalidate the cache for recipients
      return cacheSvc.get('recipients.subscribableRecipients', -1, function() { return service.getAll(); }, true)
      .then(function(v) { _recipients = v;  return v;});
    },

    // Can return undefined
    getAllRecipientsNow: function() {
      return _recipients;
    },
    // Can return undefined
    getThisOneNow: function(recipientId) {
      var valret = service.getFromRecipients(_recipients,recipientId);
      return valret;
    },

    getFromRecipients: function(recipients, recipientId) {
      if ( ! recipients )
        return null;
      for (var i = recipients.length-1; i>= 0; i--) {
        if ( recipients[i].Id ==  recipientId )
          return recipients[i];
      }
      console.log(recipientId + " not found in subscribableRecipients !!!!!!!");
      return null;
    }
	};

  // We want to make sure _recipients is initialized
  service.getRecipients();

  return service;
}])
;