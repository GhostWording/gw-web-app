angular.module('app/recipients/likelyIntentions', [])

.factory('likelyIntentionsSvc', ['$q', function ($q) {

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
        // Sweetheart
        { "RecipientTypeId": "9E2D23", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "Freq": "1-day",   "FreqLabel":"1 par jour"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "8ED62C", "IntentionLabel" : "Tu me manques",     "Freq": "1-week",  "FreqLabel":"1 par semaine"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "5CDCF2", "IntentionLabel" : "Je t'aime",         "Freq": "1-week",  "FreqLabel":"1 par semaine" },
        { "RecipientTypeId": "9E2D23", "IntentionId": "1778B7", "IntentionLabel" : "Merci",              "Freq": "3-week", "FreqLabel":"3 par semaine"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "F4566D", "IntentionLabel" : "J'ai envie de toi" },
        { "RecipientTypeId": "9E2D23", "IntentionId": "DF7A10", "IntentionLabel" : "Je suis jaloux/jalouse"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "9B2C8B", "IntentionLabel" : "Je suis en retard"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "1395B6", "IntentionLabel" : "Surprends-moi"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "D392C1", "IntentionLabel" : "Bonne nuit"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "D78AFB", "IntentionLabel" : "Je te quitte"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "70D12F", "IntentionLabel" : "Pardon"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "B0D576", "IntentionLabel" : "Il manque quelque chose"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "03B6E4", "IntentionLabel" : "Je suis là pour toi"},
        { "RecipientTypeId": "9E2D23", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour"},

        // Loveinterest
        { "RecipientTypeId": "47B7E9", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "Freq": "1-day",   "FreqLabel":"1 par jour"},
        { "RecipientTypeId": "47B7E9", "IntentionId": "8ED62C", "IntentionLabel" : "Tu me manques",     "Freq": "1-week",  "FreqLabel":"1 par semaine"},
        { "RecipientTypeId": "47B7E9", "IntentionId": "5CDCF2", "IntentionLabel" : "Je t'aime"},
        { "RecipientTypeId": "47B7E9", "IntentionId": "F4566D", "IntentionLabel" : "J'ai envie de toi", "Freq": "1-week",  "FreqLabel":"1 par semaine" },
        { "RecipientTypeId": "47B7E9", "IntentionId": "D392C1", "IntentionLabel" : "Bonne nuit",          "Freq": "1-week",  "FreqLabel":"1 par semaine" },
        { "RecipientTypeId": "47B7E9", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeId": "47B7E9", "IntentionId": "BD7387", "IntentionLabel" : "J'aimerais vous revoir"},
        { "RecipientTypeId": "47B7E9", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre"},


        // Siblings
				{ "RecipientTypeId": "87F524", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "Freq": "2-month", "FreqLabel":"2 par mois"},
				{ "RecipientTypeId": "87F524", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeId": "87F524", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeId": "87F524", "IntentionId": "9B2C8B", "IntentionLabel" : "Je suis en retard"},
        { "RecipientTypeId": "87F524", "IntentionId": "70D12F", "IntentionLabel" : "Pardon"},
        { "RecipientTypeId": "87F524", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeId": "87F524", "IntentionId": "F3F2F4", "IntentionLabel" : "Merci pour le cadeau"},
        { "RecipientTypeId": "87F524", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi"},
        { "RecipientTypeId": "87F524", "IntentionId": "03B6E4", "IntentionLabel" : "Je suis là pour toi"},
        { "RecipientTypeId": "87F524", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner !"},
//        { "RecipientTypeId": "87F524", "IntentionId": "EB020F", "IntentionLabel" : "Bonne fête"},
        { "RecipientTypeId": "87F524", "IntentionId": "2D4079", "IntentionLabel" : "J'ai besoin d'un service"},
        { "RecipientTypeId": "87F524", "IntentionId": "F57DBD", "IntentionLabel" : "Pourquoi ce silence"},
        // Parents
				{ "RecipientTypeId": "64C63D", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "Freq": "2-week", "FreqLabel":"3 par semaine"},
				{ "RecipientTypeId": "64C63D", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner",       "Freq": "1-month", "FreqLabel":"1 par mois"},
				{ "RecipientTypeId": "64C63D", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un café",   "Freq": "1-month", "FreqLabel":"1 par mois"},
				{ "RecipientTypeId": "64C63D", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "Freq": "2-week", "FreqLabel":"2 par semaine"},
				{ "RecipientTypeId": "64C63D", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeId": "64C63D", "IntentionId": "70D12F", "IntentionLabel" : "Pardon"},
        { "RecipientTypeId": "64C63D", "IntentionId": "2D4079", "IntentionLabel" : "J'ai besoin d'un service"},
        { "RecipientTypeId": "64C63D", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeId": "64C63D", "IntentionId": "F3F2F4", "IntentionLabel" : "Merci pour le cadeau"},
        { "RecipientTypeId": "64C63D", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        // LongLostFriends
				{ "RecipientTypeId": "2B4F14", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeId": "2B4F14", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "Freq": "1-month", "FreqLabel":"1 par mois"},
        { "RecipientTypeId": "2B4F14", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        // CloseFriends
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "1778B7", "IntentionLabel" : "Merci"},
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "916FFC", "IntentionLabel" : "Trinquons !",       "Freq": "2-month", "FreqLabel":"2 par mois"},
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeId": "3B9BF2", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner",       "Freq": "2-month", "FreqLabel":"2 par mois"},
				{ "RecipientTypeId": "3B9BF2", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "Freq": "2-week",  "FreqLabel":"2 par semaine"},
        { "RecipientTypeId": "3B9BF2", "IntentionId": "9B2C8B", "IntentionLabel" : "Je suis en retard"},
        { "RecipientTypeId": "3B9BF2", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        // DistantRelatives
				{ "RecipientTypeId": "BCA601", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "1-week", "FreqLabel":"1 par semaine"},
        { "RecipientTypeId": "BCA601", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre"},
        //{ "RecipientTypeId": "BCA601", "IntentionId": "EB020F", "IntentionLabel" : "Bonne fête"},
        { "RecipientTypeId": "BCA601", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        // ProfessionalNetwork
				{ "RecipientTypeId": "35AE93", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "Freq": "1-week", "FreqLabel":"1 par semaine"},
				{ "RecipientTypeId": "35AE93", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "Freq": "1-week", "FreqLabel":"1 par semaine"},
        { "RecipientTypeId": "35AE93", "IntentionId": "F18A92", "IntentionLabel" : "Restons en contact"},
			]);
		},

    getIntentionsThatCanBeSubscribedForRecipients: function () {
      return service.getLikelyIntentionsForRecipients().then(function (value) {
        return filterByFrequency(value, true);
      });
    },
    getLikelyIntentionsforGivenRecipientType: function (recipientTypeId) {
      return service.getLikelyIntentionsForRecipients().then(function (value) {
        return filterByRecipientTypeId(value, recipientTypeId);
      });
    },
    getFullIntentionObjectsFromLikelyIntentions: function(intentions, likelyIntentions) {
      var matchedIntentions=[];
      for (var i = 0; i < intentions.length; i++) {
        for (var j = 0; j < likelyIntentions.length; j++) {
          if ( intentions[i].IntentionId == likelyIntentions[j].IntentionId) {
            matchedIntentions.push(intentions[i]);
            break;
          }
        }
      }
      return matchedIntentions;
    }

  };

	return service;
}]);