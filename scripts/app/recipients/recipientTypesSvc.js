angular.module('app/recipients/recipientTypes', [])

// http://en.wikipedia.org/wiki/Mother
//Mom and mommy are used in the United States, Canada, South Africa, Philippines, India and parts of the West Midlands including Birmingham in the United Kingdom.
//Mum and mummy are used in the United Kingdom, Canada, Singapore, Australia, New Zealand, India, Pakistan, Hong Kong and Ireland. Charles, Prince of Wales publicly addressed his mother Queen Elizabeth II as "Mummy" on the occasion of her Diamond Jubilee.[37]
//Ma, mam, and mammy are used in Netherlands, Ireland, the Northern areas of the United Kingdom, and Wales; it is also used in some areas of the United States.
.factory('recipientTypesSvc', ['$q','cacheSvc', function ($q,cacheSvc) {

  var _recipientTypes;

  var service = {
    // Will be read from server in the future

    // TODO : add a property to know if they are compatible with sender gender, recipient gender, recipient context, sender / recipient age difference
    // TODO : add a property to know if they are compatible with target fbFriend properties
    // TODO : if only one in list, don't aks question

    getAll: function() {
			return $q.when([
				{ "Id": "SweetheartF",    "RecipientTypeTag": "9E2D23", "Gender": "F", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Ma chérie", "LocalLabel": "Votre chérie", "TuOuVous" : "T", "Importance" : 1},
				{ "Id": "SweetheartM",    "RecipientTypeTag": "9E2D23", "Gender": "H", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Mon chéri", "LocalLabel": "Votre chéri", "TuOuVous" : "T", "Importance" : 2},
        { "Id": "CloseFriends",   "RecipientTypeTag": "3B9BF2", "Gender": null,usualRecipient : true, subscribableRecipient : true, "dashLabel": "Ami(e) proche", "LocalLabel": "Vos copains et copines", "TuOuVous" : "T","Importance" : 2.5},
        { "Id": "OtherFriends",    "RecipientTypeTag": null,    "Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Amis divers", "LocalLabel": "Vos autres amis", "TuOuVous" : "T","Importance" : 10},
        { "Id": "LongLostFriends","RecipientTypeTag": "2B4F14", "Gender": null,usualRecipient : true, subscribableRecipient : true, "dashLabel": "Perdu(e) de vue","LocalLabel": "Vos amis perdus de vue", "TuOuVous" : "T","Importance" : 4 },
        { "Id": "LoveInterestF",  "RecipientTypeTag": "47B7E9", "Gender": "F", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Elle me plaît","LocalLabel": "La femme que j'aime", "TuOuVous" : "T", "Importance" : 2.6},
        { "Id": "LoveInterestM",  "RecipientTypeTag": "47B7E9", "Gender": "H", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Il me plaît","LocalLabel": "L'homme que j'aime", "TuOuVous" : "T", "Importance" : 3},
        { "Id": "Mother",         "RecipientTypeTag": "64C63D", "Gender": "F", usualRecipient : true, subscribableRecipient : true, "dashLabel": "Maman", "LocalLabel": "Votre maman", "TuOuVous" : "T","Importance" : 2.7},
        { "Id": "Father",         "RecipientTypeTag": "64C63D", "Gender": "H", usualRecipient : true,subscribableRecipient : true,"dashLabel": "Papa", "LocalLabel": "Votre papa", "TuOuVous" : "T","Importance" : 2.8},
				{ "Id": "Sister",         "RecipientTypeTag": "87F524", "Gender": "F", usualRecipient : true,subscribableRecipient : true,"dashLabel": "Soeur","LocalLabel": "Votre soeur", "TuOuVous" : "T","Importance" : 7},
				{ "Id": "Brother",        "RecipientTypeTag": "87F524", "Gender": "H", usualRecipient : true,subscribableRecipient : true,"dashLabel": "Frère","LocalLabel": "Votre frère", "TuOuVous" : "T","Importance" : 8},
        { "Id": "ProNetwork",     "RecipientTypeTag": "35AE93", "Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Boulot","LocalLabel": "Votre réseau pro", "TuOuVous" : null,"Importance" : 5},
        { "Id": "FamillyYoungsters","RecipientTypeTag": "420A3E", "Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Enfant, neveux, filleul", "LocalLabel": "Enfant, neveux, filleul", "TuOuVous" : "T","Importance" : 10},
				{ "Id": "DistantRelatives","RecipientTypeTag": "BCA601","Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Famille éloignée", "LocalLabel": "La famille éloignée", "TuOuVous" : "T","Importance" : 11},
//        { "Id": "OtherFamilly",    "RecipientTypeTag": null,    "Gender": null,usualRecipient : false,subscribableRecipient : false,"dashLabel": "Famille divers", "LocalLabel": "Famille autre", "TuOuVous" : "T","Importance" : 10},
			]);
		},

    getRecipients: function() {
      //console.log("getRecipients called");
      // skip local storage until we have a way to invalidate the cache for recipients
      return cacheSvc.get('recipients.recipientTypes', -1, function() { return service.getAll(); }, true)
      .then(function(v) { _recipientTypes = v;  return v;});
    },

    // Can return undefined
    getAllPossibleRecipientsNow: function() {
      return _recipientTypes;
    },
    // Can return undefined
    getThisOneNow: function(recipientId) {
      var valret = service.getFromRecipients(_recipientTypes,recipientId);
      return valret;
    },

    getFromRecipients: function(recipients, recipientId) {
      if ( ! recipients )
        return null;
      for (var i = recipients.length-1; i>= 0; i--) {
        if ( recipients[i].Id ==  recipientId )
          return recipients[i];
      }
      console.log(recipientId + " not found in recipientTypes !!!!!!!");
      return null;
    }
	};

  // We want to make sure _recipients is initialized
  service.getRecipients();

  return service;
}])
;