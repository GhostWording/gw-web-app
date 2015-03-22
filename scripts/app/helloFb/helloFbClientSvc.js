angular.module('app/helloFb/helloFbClientSvc', [
  'common/texts/textsSvc',
  'common/textSelection/weightedTextRandomPickSvc',
  'common/filters/filterHelperSvc',
  'common/users/currentUser'
])

.factory('helloFbClientSvc',  ['weightedTextRandomPickSvc','textsSvc','currentUser','filterHelperSvc',
function( weightedTextRandomPickSvc,textsSvc,currentUser,filterHelperSvc) {

  var service = {

    // Get welcome text groups for mums : a list of texts that will be displayed when the app launches for the first time
    getMumWelcomeTextList: function (areaName,languageCode,cultureCode) {
      var groupId;
      switch (languageCode) {
        case 'fr':
          groupId = '774EE7';
          break;
        default:
          groupId = '53A0E1';
          break;
      }
      return textsSvc.getTextListForGroup(areaName, groupId, cultureCode, true, true);
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
        { name: 'jokes',               defaultWeight: 0.4, userWeight: 1, label: "Joke of the day" },
        { name: 'a-few-words-for-you', defaultWeight: 1,   userWeight: 1, label: "A few words" },
        { name: 'facebook-status',     defaultWeight: 1,   userWeight: 1, label: "Status" },
        { name: 'positive-thoughts',   defaultWeight: 1,   userWeight: 1, label: "Thought of the day"  },
        { name: 'stop-the-world',      defaultWeight: 0.3,  userWeight: 1, label: "Stop the world"  },
        { name: 'humorous-insults',    defaultWeight: 0.1,  userWeight: 1, label: "Grrrrr"},


      ];
      return arr;
    },

    filterTextsForThisApp: function (texts,relationTypeId,recipientGender,userGender) {
      var filters = filterHelperSvc.createEmptyFilters();
      // Set relation type
      filterHelperSvc.setRecipientTypeTag(filters, relationTypeId);
      // Set recipient gender
      filterHelperSvc.setRecipientGender(filters, recipientGender); // or 'H' for man
      // Set polite verbal form if required
      filterHelperSvc.setPoliteVerbalForm(filters,'T');
      // Set user gender if we know it
      if (userGender == 'F' || userGender == 'H') // H for Homme = Male
        currentUser.gender = userGender;

      return  filterHelperSvc.getFilteredList(texts, currentUser, filters);
    },

    attachFilteredTextListsToIntentions: function (weightedIntentions, resolvedTextLists,relationTypeId,recipientGender,userGender) {
      var nbFilteredTexts = 0;
      var nbTextsForIntentions = 0;
      for (var i = 0; i < weightedIntentions.length; i++) {
        var texts = resolvedTextLists[i];
        // Filter texts !!
        var filteredText = service.filterTextsForThisApp(texts,relationTypeId,recipientGender,userGender);
        console.log(weightedIntentions[i].name + ' ' + texts.length + ' ' + filteredText.length);
        weightedIntentions[i].texts = filteredText;
        nbFilteredTexts += filteredText.length;
        nbTextsForIntentions += texts.length;
      }
      console.log("------ TOTAL : " + nbTextsForIntentions);
      console.log("------ TOTAL FILTERED : " + nbFilteredTexts);
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