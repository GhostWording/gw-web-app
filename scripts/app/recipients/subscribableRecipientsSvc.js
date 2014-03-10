angular.module('app/recipients/subscribableRecipientsSvc', [])

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
				{ "Id": "Mam", "RecipientTypeId": "64C63D", "Gender": "M", "LocalLabel": "Papa"},
				{ "Id": "Dad", "RecipientTypeId": "64C63D", "Gender": "F", "LocalLabel": "Maman"},
				{ "Id": "DistantRelatives", "RecipientTypeId": "BCA601", "Gender": "I", "LocalLabel": "La famille éloignée"},
				{ "Id": "ProNetwork", "RecipientTypeId": "35AE93", "Gender": "I", "LocalLabel": "Mon réseau pro"}
			]);
		}
	};
	return service;
}])
