angular.module('app/helloFb/helloFbClientSvc', [
  'common/texts/textsSvc',
  'common/textSelection/weightedTextRandomPickSvc',
  'common/filters/filterHelperSvc',
  'common/users/currentUser'
])

.factory('helloFbClientSvc',  ['weightedTextRandomPickSvc','textsSvc','currentUser','filterHelperSvc','getTextsForRecipientSvc',
function( weightedTextRandomPickSvc,textsSvc,currentUser,filterHelperSvc,getTextsForRecipientSvc) {

  var service = {

    // Get welcome text groups for mums : a list of texts that will be displayed when the app launches for the first time
    getFbWelcomeTextList: function (areaName,cultureCode,relationTypeId, recipientGender,userGender) {
      var retval = getTextsForRecipientSvc.textPromisesForSingleIntentionSlug(areaName,'facebook-status', cultureCode, relationTypeId, recipientGender).then(function(texts) {
        console.log("getFbWelcomeTextList count : " + texts.length);
        var filteredText = service.filterTextsForThisApp(texts,relationTypeId,recipientGender,userGender);
        console.log("filteredText count : " + filteredText.length);
        return texts;
      });
      return retval;

    },

    // For facebook status,  no reason to exclude texts from first positions
    excludeTextFromFirstPositionOfFbTextList: function (text) {
      return false;
    },
    // For the welcome group, we only want to pick some of the good ones
    excludeTextFromList: function (text) {
      return text.SortBy >= 30;
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
        { name: 'humorous-insults',    defaultWeight: 0.2,  userWeight: 1, label: "Grrrrr"},
      ];
      return arr;
    },

    filterTextsForThisApp: function (texts,relationTypeId,recipientGender,userGender) {
      var filters = filterHelperSvc.createEmptyFilters();
      // Set relation type
      filterHelperSvc.setRecipientTypeTag(filters, relationTypeId);
      // Set recipient gender
      filterHelperSvc.setRecipientGender(filters, recipientGender);
      // Set polite verbal form if required
      //filterHelperSvc.setPoliteVerbalForm(filters,'T');
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