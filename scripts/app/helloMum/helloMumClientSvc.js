angular.module('app/helloMum/helloMumClientSvc', ['common/texts/textsSvc'])

.factory('helloMumClientSvc',  ['currentLanguage','weightedTextRandomPickSvc','textsSvc',
function( currentLanguage,weightedTextRandomPickSvc,textsSvc) {

  var service = {

    // Get welcome text groups for mums : a list of texts that will be displayed when the app launches for the first time
    getMumWelcomeTextList: function () {
      var groupId;
      switch (currentLanguage.getLanguageCode()) {
        case 'fr':
          groupId = '774EE7';
          break;
        default:
          groupId = '53A0E1';
          break;
      }
      return textsSvc.getTextListForGroup('HelloMum', groupId, currentLanguage.getCultureCode(), true, true);
    },

    // For mums, we do not want the first texts to be is Jokes, facebook status, positive thoughts, or other impersonal texts
    excludeTextFromFirstPositionOfMumTextList: function (text) {
      var intentionId = text.IntentionId;
      if (intentionId == "0B1EA1" || intentionId == "2E2986" || intentionId == "A64962" || intentionId == "67CC40")
        return true;
      return false;
    },


    // From which intentions should we pick the texts and with what probability ?
    intentionsToDisplay: function () {
      // defaultWeight : 1 by default, between 0 and 1 if we feel an intention contains too many texts
      // userWeight    : (0, 1 or 4) <=> (none, few,  many)
      var arr = [
        { name: 'how-are-you', defaultWeight: 1, userWeight: 1 },
        { name: 'I-think-of-you', defaultWeight: 1, userWeight: 1 },
        { name: 'jokes', defaultWeight: 0.4, userWeight: 1, label: "Joke of the day" },
        { name: 'thank-you', defaultWeight: 1, userWeight: 1 },
        { name: 'a-few-words-for-you', defaultWeight: 1, userWeight: 1 },
        { name: 'I-love-you', defaultWeight: 1, userWeight: 1 },
        { name: 'I-miss-you', defaultWeight: 1, userWeight: 1 },
        { name: 'I-am-here-for-you', defaultWeight: 0.5, userWeight: 1 },
        { name: 'facebook-status', defaultWeight: 0.4, userWeight: 1, label: "Thought of the day" },
        { name: 'positive-thoughts', defaultWeight: 0.6, userWeight: 1, label: "Thought of the day"  },
        { name: 'would-you-care-for-a-drink', defaultWeight: 0.5, userWeight: 1 },
      ];
      return arr;
    },

    // Pick a random text until satisfied
    chooseText : function(weightedIntentions) {
      var choice;
      do {
        choice = weightedTextRandomPickSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
      } while (service.happyWithText(choice.text) === false);
      return choice;
    },
    // Always returns true, instead we could check that a text has not been previously disliked, or seen to many times
    happyWithText : function(pickedText) {
      return true;
    }


  };

  return  service;
}]);