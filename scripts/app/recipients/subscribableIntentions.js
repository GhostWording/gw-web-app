angular.module('app/recipients/subscribableIntentions', [])

.factory('subscribableIntentionsSvc', ['$q', function ($q) {

  var filterByFrequency = function (intentionsForRecipient,onlySubscribable) {
    var retval = [];
    angular.forEach(intentionsForRecipient,
    function (t) {
      var isARepeatRecipient = t.Freq && t.Freq != 'once';
      if ( onlySubscribable == isARepeatRecipient )
        retval.push(t);
    });
    return retval;
  };

  var filterByRecipientTypeId = function (intentionsForRecipient,recipientTypeId) {
    var retval = [];
    angular.forEach(intentionsForRecipient,
    function (t) {
      if (t.RecipientTypeId == recipientTypeId )
        retval.push(t);
    });
    return retval;
  };


  var service = {

		getLikelyIntentionsForRecipients: function() {
			return $q.when([
				{ "RecipientTypeId": "9E2D23", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "Freq": "1-day",   "FreqLabel":"1 par jour"}, // Sweetheart => Je pense à toi
				{ "RecipientTypeId": "9E2D23", "IntentionId": "F4566D", "IntentionLabel" : "J'ai envie de toi", "Freq": "1-week",  "FreqLabel":"1 par semaine" }, // Sweetheart => J'ai envie de toi
				{ "RecipientTypeId": "9E2D23", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "Freq": "3-week", "FreqLabel":"3 par semaine"}, // Sweetheart => Merci
				{ "RecipientTypeId": "87F524", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "Freq": "2-month", "FreqLabel":"2 par mois"}, // Siblings => Un peu d'humour
				{ "RecipientTypeId": "87F524", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "Freq": "2-month", "FreqLabel":"2 par mois"}, // Siblings => Merci
				{ "RecipientTypeId": "87F524", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "Freq": "2-month", "FreqLabel":"2 par mois"}, // Siblings => Prenons un verre
				{ "RecipientTypeId": "64C63D", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "Freq": "2-week", "FreqLabel":"3 par semaine"}, // Parents  => Je pense à toi
				{ "RecipientTypeId": "64C63D", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner",       "Freq": "1-month", "FreqLabel":"1 par mois"},    // Parents
				{ "RecipientTypeId": "64C63D", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un café",   "Freq": "1-month", "FreqLabel":"1 par mois"},   // Parents
				{ "RecipientTypeId": "64C63D", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "Freq": "2-week", "FreqLabel":"2 par semaine"}, // Parents
				{ "RecipientTypeId": "64C63D", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "Freq": "2-month", "FreqLabel":"2 par mois"},    // Parents
				{ "RecipientTypeId": "2B4F14", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "2-month", "FreqLabel":"2 par mois"},   // LongLostFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "Freq": "2-month", "FreqLabel":"2 par mois"},   // CloseFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "916FFC", "IntentionLabel" : "Trinquons !",       "Freq": "2-month", "FreqLabel":"2 par mois"},   // CloseFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "2-month", "FreqLabel":"2 par mois"},   // CloseFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "Freq": "2-week", "FreqLabel":"2 par semaine"}, // CloseFriends
				{ "RecipientTypeId": "BCA601", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "1-week", "FreqLabel":"1 par semaine"}, // DistantRelativs
				{ "RecipientTypeId": "35AE93", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "1-week", "FreqLabel":"1 par semaine"}, // ProfessionalNetwork
				{ "RecipientTypeId": "35AE93", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "Freq": "1-week", "FreqLabel":"1 par semaine"}, // ProfessionalNetwork
        { "RecipientTypeId": "35AE93", "IntentionId": "F18A92", "IntentionLabel" : "Restons en contact"}, // ProfessionalNetwork

			]);
		},

    getIntentionsThatCanBeSubscribedForRecipients: function () {
      return service.getLikelyIntentionsForRecipients().then(function (value) {
        return filterByFrequency(value, true);
      })
    },
    getLikelyIntentionsforGivenRecipienttype: function (recipientTypeId) {
      return service.getLikelyIntentionsForRecipients().then(function (value) {
        return filterByRecipientTypeId(value, recipientTypeId);
      })
    }

  };

	return service;
}]);