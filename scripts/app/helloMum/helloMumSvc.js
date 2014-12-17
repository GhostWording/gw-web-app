angular.module('app/helloMum/helloMumSvc', ['common/services/randomHelperSvc'])

// Picks a text from a set of intentions
// Chances of being picked include default
// - Default weight of intention
// - User preference for intention (userWeight)
// - Number of texts in intentions
// - SortOrder of text
.factory('helloMumSvc', ['randomHelperSvc',function (randomHelperSvc) {

  var textSortByBoostLimit  = 30; // When text.SortBy strictly less than this,
  var textSortByBoostFactor = 3;  // Texts will have x time more chance of being chosen

  var textSortHandicapLimit  = 999; // When text.SortBy strictly more than this,
  var textSortHandicapFactor = 0.2; // Texts will rarely be shown


  var service = {
    // defaultWeight : 1 by default, between 0 and 1 if we feel an intention contains too many texts
    // userWeight    : (0, 1 or 4) <=> (none, few,  many)
    intentionDefaultWeights: function () {
      var arr = [
        { name: 'how-are-you',        defaultWeight: 1,   userWeight: 1 },
        { name: 'I-think-of-you',     defaultWeight: 1,   userWeight: 1 },
        { name: 'jokes',              defaultWeight: 0.5, userWeight: 1, label: "Joke of the day" },
        { name: 'thank-you',          defaultWeight: 1,   userWeight: 1 },
        { name: 'a-few-words-for-you',defaultWeight: 1,   userWeight: 1 },
        { name: 'I-love-you',         defaultWeight: 1,   userWeight: 1 },
        { name: 'I-miss-you',         defaultWeight: 1,   userWeight: 1 },
        { name: 'I-am-here-for-you',  defaultWeight: 0.5, userWeight: 1 },
        { name: 'facebook-status',    defaultWeight: 0.5, userWeight: 1, label: "Thought of the day" },
        { name: 'positive-thoughts',  defaultWeight: 1,  userWeight: 1, label: "Thought of the day"  },
        { name: 'would-you-care-for-a-drink', defaultWeight: 1,   userWeight: 1 },
      ];
    return arr;
    },

    // add a weight field.
    setIntentionWeights: function(arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].weight = arr[i].defaultWeight * arr[i].userWeight;
      }
    },

    pickOneWeightedIntention: function (weightedIntentions) {
      // We could set sizes to one if we don't want the number of elements of influence chances of being picked
      for (var i = 0; i < weightedIntentions.length; i++) {
        weightedIntentions[i].size = weightedIntentions[i].texts.length;
      }
      // Choose one of the text lists
      return randomHelperSvc.weightedRandomPick(weightedIntentions);
    },

    setTextWeights: function(textList) {
      for (var i= 0; i < textList.length; i++) {
        var text = textList[i];
        //console.log(text.SortBy + ' ' + text.Content);
        if (text.SortBy < textSortByBoostLimit ) {
          text.weight = textSortByBoostFactor;
        }

      }
    },

    pickOneTextFromTextList:function(textList) {
      // Each text will have size==1 and weight == 1 by default
      service.setTextWeights(textList);
      return randomHelperSvc.weightedRandomPick(textList);
    },

    pickOneTextFromWeightedIntentionArray: function (weightedIntentions) {
      var chosenIntention = service.pickOneWeightedIntention(weightedIntentions);
      var chosenText  = service.pickOneTextFromTextList(chosenIntention.texts);
      return {intention: chosenIntention, text: chosenText};
    }
};

  return service;
}]);