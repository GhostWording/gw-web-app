angular.module('app/recipients/subscribableIntentionsSvc', [])

.factory('subscribableIntentionsSvc', ['$q', function ($q) {
	var service = {

		getAllPossibleSubscriptions: function() {
			return $q.when([
				{ "RecipientTypeId": "9E2D23", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "FreqNumerator": "1", "FreqPeriod":"jour"}, // Sweetheart => Je pense à toi
				{ "RecipientTypeId": "9E2D23", "IntentionId": "F4566D", "IntentionLabel" : "J'ai envie de toi", "FreqNumerator": "1", "FreqPeriod":"semaine" }, // Sweetheart => J'ai envie de toi
				{ "RecipientTypeId": "9E2D23", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "3", "FreqPeriod":"semaine"}, // Sweetheart => Merci
				{ "RecipientTypeId": "87F524", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "FreqNumerator": "2", "FreqPeriod":"mois"}, // Siblings => Un peu d'humour
				{ "RecipientTypeId": "87F524", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "2", "FreqPeriod":"mois"}, // Siblings => Merci
				{ "RecipientTypeId": "87F524", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "FreqNumerator": "2", "FreqPeriod":"mois"}, // Siblings => Prenons un verre
				{ "RecipientTypeId": "64C63D", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "FreqNumerator": "2", "FreqPeriod":"semaine"}, // Parents  => Je pense à toi
				{ "RecipientTypeId": "64C63D", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner",       "FreqNumerator": "1", "FreqPeriod":"mois"},    // Parents
				{ "RecipientTypeId": "64C63D", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un café",   "FreqNumerator": "1", "FreqPeriod":"mois"},   // Parents
				{ "RecipientTypeId": "64C63D", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "FreqNumerator": "2", "FreqPeriod":"semaine"}, // Parents
				{ "RecipientTypeId": "64C63D", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "2", "FreqPeriod":"mois"},    // Parents
				{ "RecipientTypeId": "2B4F14", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "FreqNumerator": "2", "FreqPeriod":"mois"},   // LongLostFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "FreqNumerator": "2", "FreqPeriod":"mois"},   // CloseFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "916FFC", "IntentionLabel" : "Trinquons !",       "FreqNumerator": "2", "FreqPeriod":"mois"},   // CloseFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "FreqNumerator": "2", "FreqPeriod":"mois"},   // CloseFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "FreqNumerator": "2", "FreqPeriod":"semaine"}, // CloseFriends
				{ "RecipientTypeId": "BCA601", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",   "FreqNumerator": "1", "FreqPeriod":"semaine"}, // DistantRelativs
				{ "RecipientTypeId": "35AE93", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",   "FreqNumerator": "1", "FreqPeriod":"semaine"}, // ProfessionalNetwork
				{ "RecipientTypeId": "35AE93", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",   "FreqNumerator": "1", "FreqPeriod":"semaine"}, // ProfessionalNetwork
			]);
		}

	};
	return service;
}])
