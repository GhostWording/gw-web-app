angular.module('app/recipients/subscribableRecipients', [])

// http://en.wikipedia.org/wiki/Mother
//Mom and mommy are used in the United States, Canada, South Africa, Philippines, India and parts of the West Midlands including Birmingham in the United Kingdom.
//Mum and mummy are used in the United Kingdom, Canada, Singapore, Australia, New Zealand, India, Pakistan, Hong Kong and Ireland. Charles, Prince of Wales publicly addressed his mother Queen Elizabeth II as "Mummy" on the occasion of her Diamond Jubilee.[37]
//Ma, mam, and mammy are used in Netherlands, Ireland, the Northern areas of the United Kingdom, and Wales; it is also used in some areas of the United States.
.factory('subscribableRecipientsSvc', ['$q', function ($q) {
	var service = {
		getAll: function() {
			return $q.when([
				{ "Id": "SweetheartF", "RecipientTypeId": "9E2D23", "Gender": "F", "LocalLabel": "Ma chérie"},
				{ "Id": "SweetheartM", "RecipientTypeId": "9E2D23", "Gender": "M", "LocalLabel": "Mon chéri"},
				{ "Id": "CloseFriends", "RecipientTypeId": "3B9BF2", "Gender": "I", "LocalLabel": "Les copains et les copines"},
				{ "Id": "LongLostFriends", "RecipientTypeId": "2B4F14", "Gender": "I", "LocalLabel": "Les amis perdus de vue"},
				{ "Id": "Sister", "RecipientTypeId": "87F524", "Gender": "F", "LocalLabel": "Ma soeur"},
				{ "Id": "Brother", "RecipientTypeId": "87F524", "Gender": "M", "LocalLabel": "Mon frère"},
				{ "Id": "Father", "RecipientTypeId": "64C63D", "Gender": "M", "LocalLabel": "Papa"},
				{ "Id": "Mother", "RecipientTypeId": "64C63D", "Gender": "F", "LocalLabel": "Maman"},
				{ "Id": "DistantRelatives", "RecipientTypeId": "BCA601", "Gender": "I", "LocalLabel": "La famille éloignée"},
				{ "Id": "ProNetwork", "RecipientTypeId": "35AE93", "Gender": "I", "LocalLabel": "Mon réseau pro"}
			]);
		}
	};
	return service;
}]);