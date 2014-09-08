angular.module('app/recipients/likelyIntentionsForRecipientTypes', [])

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

  var filterByRecipientTypeTag = function (intentionsForRecipient,recipientTypeTag) {
    var retval = [];
    angular.forEach(intentionsForRecipient,
    function (t) {
      if (t.RecipientTypeTag == recipientTypeTag )
        retval.push(t);
    });
    return retval;
  };


  var service = {

		getLikelyIntentionsForRecipients: function() {
			return $q.when([
        // Sweetheart
        { "RecipientTypeTag": "9E2D23", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",  "default":true,  "Freq": "1-day",   "FreqLabel":"1 par jour"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "8ED62C", "IntentionLabel" : "Tu me manques",   "default":false,  "Freq": "1-week",  "FreqLabel":"1 par semaine"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "5CDCF2", "IntentionLabel" : "Je t'aime",       "default":false,  "Freq": "1-week",  "FreqLabel":"1 par semaine" },
        { "RecipientTypeTag": "9E2D23", "IntentionId": "1778B7", "IntentionLabel" : "Merci"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "F4566D", "IntentionLabel" : "J'ai envie de toi" },
        { "RecipientTypeTag": "9E2D23", "IntentionId": "DF7A10", "IntentionLabel" : "Je suis jaloux/jalouse"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "9B2C8B", "IntentionLabel" : "Je suis en retard"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "1395B6", "IntentionLabel" : "Surprends-moi"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "D392C1", "IntentionLabel" : "Bonne nuit"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "D78AFB", "IntentionLabel" : "Je te quitte"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "70D12F", "IntentionLabel" : "Pardon"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "B0D576", "IntentionLabel" : "Il manque quelque chose"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "03B6E4", "IntentionLabel" : "Je suis là pour toi"},
        { "RecipientTypeTag": "9E2D23", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour", "default":false,  "Freq": "2-week",  "FreqLabel":"2 par semaine"},

        // Loveinterest
        { "RecipientTypeTag": "47B7E9", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",   "default":true,  "Freq": "1-day",   "FreqLabel":"1 par jour"},
        { "RecipientTypeTag": "47B7E9", "IntentionId": "5CDCF2", "IntentionLabel" : "Je t'aime",        "default":true,  "Freq": "1-week",  "FreqLabel":"1 par semaine"},
        { "RecipientTypeTag": "47B7E9", "IntentionId": "F4566D", "IntentionLabel" : "J'ai envie de toi","default":true,  "Freq": "1-week",  "FreqLabel":"1 par semaine" },
        { "RecipientTypeTag": "47B7E9", "IntentionId": "8ED62C", "IntentionLabel" : "Tu me manques",    "default":false, "Freq": "1-week",  "FreqLabel":"1 par semaine"},
        { "RecipientTypeTag": "47B7E9", "IntentionId": "D392C1", "IntentionLabel" : "Bonne nuit",       "default":false, "Freq": "1-week",  "FreqLabel":"1 par semaine" },
        { "RecipientTypeTag": "47B7E9", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeTag": "47B7E9", "IntentionId": "BD7387", "IntentionLabel" : "J'aimerais vous revoir"},
        { "RecipientTypeTag": "47B7E9", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre"},

        // Siblings
				{ "RecipientTypeTag": "87F524", "IntentionId": "1778B7", "IntentionLabel" : "Merci",             "default":false, "Freq": "2-month", "FreqLabel":"2 par mois"},
				{ "RecipientTypeTag": "87F524", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "default":true, "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeTag": "87F524", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "default":true, "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeTag": "87F524", "IntentionId": "9B2C8B", "IntentionLabel" : "Je suis en retard"},
        { "RecipientTypeTag": "87F524", "IntentionId": "70D12F", "IntentionLabel" : "Pardon"},
        { "RecipientTypeTag": "87F524", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeTag": "87F524", "IntentionId": "F3F2F4", "IntentionLabel" : "Merci pour le cadeau"},
        { "RecipientTypeTag": "87F524", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi"},
        { "RecipientTypeTag": "87F524", "IntentionId": "03B6E4", "IntentionLabel" : "Je suis là pour toi"},
        { "RecipientTypeTag": "87F524", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner !"},
//        { "RecipientTypeTag": "87F524", "IntentionId": "EB020F", "IntentionLabel" : "Bonne fête"},
        { "RecipientTypeTag": "87F524", "IntentionId": "2D4079", "IntentionLabel" : "J'ai besoin d'un service"},
        { "RecipientTypeTag": "87F524", "IntentionId": "F57DBD", "IntentionLabel" : "Pourquoi ce silence"},
        // Parents
				{ "RecipientTypeTag": "64C63D", "IntentionId": "016E91", "IntentionLabel" : "Je pense à toi",    "default":true, "Freq": "2-week", "FreqLabel":"2 par semaine"},
				{ "RecipientTypeTag": "64C63D", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner"},
				{ "RecipientTypeTag": "64C63D", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un café"},
				{ "RecipientTypeTag": "64C63D", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "default":false, "Freq": "2-week", "FreqLabel":"2 par semaine"},
				{ "RecipientTypeTag": "64C63D", "IntentionId": "1778B7", "IntentionLabel" : "Merci"},
        { "RecipientTypeTag": "64C63D", "IntentionId": "70D12F", "IntentionLabel" : "Pardon"},
        { "RecipientTypeTag": "64C63D", "IntentionId": "2D4079", "IntentionLabel" : "J'ai besoin d'un service"},
        { "RecipientTypeTag": "64C63D", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeTag": "64C63D", "IntentionId": "F3F2F4", "IntentionLabel" : "Merci pour le cadeau"},
        { "RecipientTypeTag": "64C63D", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        // LongLostFriends
				{ "RecipientTypeTag": "2B4F14", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "default":true, "Freq": "2-month", "FreqLabel":"2 par mois"},
//        { "RecipientTypeTag": "2B4F14", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "Freq": "1-month", "FreqLabel":"1 par mois"},
        { "RecipientTypeTag": "2B4F14", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre"},
        { "RecipientTypeTag": "2B4F14", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        // CloseFriends
				{ "RecipientTypeTag": "3B9BF2", "IntentionId": "1778B7", "IntentionLabel" : "Merci"},
        { "RecipientTypeTag": "3B9BF2", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?"},
				{ "RecipientTypeTag": "3B9BF2", "IntentionId": "916FFC", "IntentionLabel" : "Trinquons !",       "default":true, "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeTag": "3B9BF2", "IntentionId": "0B1EA1", "IntentionLabel" : "Un peu d'humour",   "default":true, "Freq": "2-week",  "FreqLabel":"2 par semaine"},
        { "RecipientTypeTag": "3B9BF2", "IntentionId": "D19840", "IntentionLabel" : "Venez dîner",       "default":false, "Freq": "2-month", "FreqLabel":"2 par mois"},
        { "RecipientTypeTag": "3B9BF2", "IntentionId": "9B2C8B", "IntentionLabel" : "Je suis en retard"},
        { "RecipientTypeTag": "3B9BF2", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        { "RecipientTypeTag": "3B9BF2", "IntentionId": "03B6E4", "IntentionLabel" : "Je suis là pour toi"},
        // DistantRelatives
				{ "RecipientTypeTag": "BCA601", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "default":true, "Freq": "1-week", "FreqLabel":"1 par semaine"},
        { "RecipientTypeTag": "BCA601", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre"},
        //{ "RecipientTypeTag": "BCA601", "IntentionId": "EB020F", "IntentionLabel" : "Bonne fête"},
        { "RecipientTypeTag": "BCA601", "IntentionId": "A730B4", "IntentionLabel" : "Bon anniversaire"},
        // ProfessionalNetwork
				{ "RecipientTypeTag": "35AE93", "IntentionId": "F82B5C", "IntentionLabel" : "Que deviens-tu ?",  "default":true, "Freq": "1-week", "FreqLabel":"1 par semaine"},
				{ "RecipientTypeTag": "35AE93", "IntentionId": "916FFC", "IntentionLabel" : "Prenons un verre",  "default":true, "Freq": "1-week", "FreqLabel":"1 par semaine"},
        { "RecipientTypeTag": "35AE93", "IntentionId": "F18A92", "IntentionLabel" : "Restons en contact"},
			]);
		},

    getIntentionsThatCanBeSubscribedForRecipients: function () {
      return service.getLikelyIntentionsForRecipients().then(function (value) {
        return filterByFrequency(value, true);
      });
    },
    getLikelyIntentionsforGivenRecipientType: function (recipientTypeTag) {
      return service.getLikelyIntentionsForRecipients().then(function (value) {
        return filterByRecipientTypeTag(value, recipientTypeTag);
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