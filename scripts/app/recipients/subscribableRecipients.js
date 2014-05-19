angular.module('app/recipients/subscribableRecipients', [])

// http://en.wikipedia.org/wiki/Mother
//Mom and mommy are used in the United States, Canada, South Africa, Philippines, India and parts of the West Midlands including Birmingham in the United Kingdom.
//Mum and mummy are used in the United Kingdom, Canada, Singapore, Australia, New Zealand, India, Pakistan, Hong Kong and Ireland. Charles, Prince of Wales publicly addressed his mother Queen Elizabeth II as "Mummy" on the occasion of her Diamond Jubilee.[37]
//Ma, mam, and mammy are used in Netherlands, Ireland, the Northern areas of the United Kingdom, and Wales; it is also used in some areas of the United States.
.factory('subscribableRecipientsSvc', ['$q','cacheSvc', function ($q,cacheSvc) {

  var service = {
    // Will be read from server in the future
    // TODO : add a property to kwon if they are subscribable
		getAll: function() {
			return $q.when([
				{ "Id": "SweetheartF", "RecipientTypeId": "9E2D23", "Gender": "F", "LocalLabel": "Votre chérie", "TuOuVous" : "T", "Importance" : 1},
				{ "Id": "SweetheartM", "RecipientTypeId": "9E2D23", "Gender": "H", "LocalLabel": "Votre chéri", "TuOuVous" : "T", "Importance" : 2},
        { "Id": "ProNetwork", "RecipientTypeId": "35AE93", "Gender": null, "LocalLabel": "Votre réseau pro", "TuOuVous" : null,"Importance" : 4},
				{ "Id": "CloseFriends", "RecipientTypeId": "3B9BF2", "Gender": null, "LocalLabel": "Vos copains et copines", "TuOuVous" : null,"Importance" : 3},
				{ "Id": "LongLostFriends", "RecipientTypeId": "2B4F14", "Gender": null, "LocalLabel": "Vos amis perdus de vue", "TuOuVous" : "T","Importance" : 9},
        { "Id": "Mother", "RecipientTypeId": "64C63D", "Gender": "F", "LocalLabel": "Votre maman", "TuOuVous" : "T","Importance" : 5},
        { "Id": "Father", "RecipientTypeId": "64C63D", "Gender": "H", "LocalLabel": "Votre papa", "TuOuVous" : "T","Importance" : 6},
				{ "Id": "Sister", "RecipientTypeId": "87F524", "Gender": "F", "LocalLabel": "Votre soeur", "TuOuVous" : "T","Importance" : 7},
				{ "Id": "Brother", "RecipientTypeId": "87F524", "Gender": "H", "LocalLabel": "Votre frère", "TuOuVous" : "T","Importance" : 8},
				{ "Id": "DistantRelatives", "RecipientTypeId": "BCA601", "Gender": null, "LocalLabel": "La famille éloignée", "TuOuVous" : "T","Importance" : 10},
			]);
		},

    getRecipients: function() {
      return cacheSvc.get('recipients.subscribableRecipients', -1, function() { return service.getAll(); },
        true); // skip local storage until we have a way to invalidate the cache
    },

    getFromRecipients: function(recipients, recipientId) {
      for (var i = recipients.length-1; i>= 0; i--) {
        if ( recipients[i].Id ==  recipientId )
          return recipients[i];
      }
      console.log(recipientId + " not found in subscribableRecipients !!!!!!!");
      return null;
    }
	};

  return service;
}])
;