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
				{ "Id": "SweetheartF", "RecipientTypeId": "9E2D23", "Gender": "F", "LocalLabel": "Ma chérie", "TuOuVous" : "T"},
				{ "Id": "SweetheartM", "RecipientTypeId": "9E2D23", "Gender": "H", "LocalLabel": "Mon chéri", "TuOuVous" : "T"},
				{ "Id": "CloseFriends", "RecipientTypeId": "3B9BF2", "Gender": "I", "LocalLabel": "Les copains et les copines", "TuOuVous" : "T"},
				{ "Id": "LongLostFriends", "RecipientTypeId": "2B4F14", "Gender": "I", "LocalLabel": "Les amis perdus de vue", "TuOuVous" : "T"},
				{ "Id": "Sister", "RecipientTypeId": "87F524", "Gender": "F", "LocalLabel": "Ma soeur", "TuOuVous" : "T"},
				{ "Id": "Brother", "RecipientTypeId": "87F524", "Gender": "H", "LocalLabel": "Mon frère", "TuOuVous" : "T"},
				{ "Id": "Father", "RecipientTypeId": "64C63D", "Gender": "H", "LocalLabel": "Papa", "TuOuVous" : "T"},
				{ "Id": "Mother", "RecipientTypeId": "64C63D", "Gender": "F", "LocalLabel": "Maman", "TuOuVous" : "T"},
				{ "Id": "DistantRelatives", "RecipientTypeId": "BCA601", "Gender": "I", "LocalLabel": "La famille éloignée", "TuOuVous" : "T"},
				{ "Id": "ProNetwork", "RecipientTypeId": "35AE93", "Gender": "I", "LocalLabel": "Mon réseau pro", "TuOuVous" : "I"}
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
}]);