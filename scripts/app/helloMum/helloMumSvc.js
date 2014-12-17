angular.module('app/helloMum/helloMumSvc', ['common/services/randomHelperSvc'])

.factory('helloMumSvc', ['randomHelperSvc','textsSvc','filterHelperSvc','currentUser',
function (randomHelperSvc,textsSvc,filterHelperSvc,currentUser) {

  var service = {

    // defaultWeight : 1 by default, between 0 and 1 if we feel an intention contains too many texts
    // userWeight    : (0, 1 or 4) <=> (none, few,  many)
    intentionDefaultWeights: function () {
      var arr = [
        { name: 'how-are-you',        defaultWeight: 1,   userWeight: 1 },
        { name: 'I-think-of-you',     defaultWeight: 1,   userWeight: 1 },
        { name: 'jokes',              defaultWeight: 0.5, userWeight: 1 },
        { name: 'thank-you',          defaultWeight: 1,   userWeight: 1 },
        { name: 'a-few-words-for-you',defaultWeight: 1,   userWeight: 1 },
        { name: 'I-love-you',         defaultWeight: 1,   userWeight: 1 },
        { name: 'I-miss-you',         defaultWeight: 1,   userWeight: 1 },
        { name: 'I-am-here-for-you',  defaultWeight: 0.5, userWeight: 1 },
        { name: 'facebook-status',    defaultWeight: 0.5, userWeight: 1 },
        { name: 'positive-thoughts',  defaultWeight: 1,  userWeight: 1 },
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

    setUserGender: function(gender) {
      if ( gender == 'F' || gender == 'H' ) // H for Homme for Male
        currentUser.gender = gender;
    },
    createMotherFilter: function() {
      var filters = filterHelperSvc.createEmptyFilters();
      // Set relation type to parent
      filterHelperSvc.setRecipientTypeTag(filters,'64C63D');
      // Set recipient gender
      filterHelperSvc.setRecipientGender(filters,'F'); // or 'H' for man
      return filters;
    },
    filterTextsForMother: function(texts) {
      var filters = service.createMotherFilter();
      // currentUser will have all properties to default unless you set one.
      return  filterHelperSvc.getFilteredList(texts, currentUser, filters);
    },

    textListPromises: function(arr,culture) {
      var textListPromises = [];
      for (var i=0; i< arr.length; i++) {
        // TODO : when we have the API for that, we can add relation type to the parameters
        var p = textsSvc.getTextList('HelloMum',arr[i].name,culture,true,false);
        textListPromises.push(p);
      }
      return textListPromises;
    },

    attachFilteredTextListsToWeightedIntentions: function (weightedIntentions,resolvedTextLists) {
      var nbFilteredTexts = 0;  var nbTextsForIntentions = 0;
      for (var i = 0; i < weightedIntentions.length; i++) {
        var texts = resolvedTextLists[i];
        var filteredText = service.filterTextsForMother(texts);
        console.log(weightedIntentions[i].name + ' ' + texts.length + ' ' + filteredText.length);

        weightedIntentions[i].texts = filteredText;
        nbFilteredTexts += filteredText.length;   nbTextsForIntentions += texts.length;
      }
      console.log("------ TOTAL : " + nbTextsForIntentions);  console.log("------ TOTAL FILTERED : " + nbFilteredTexts);
    },

    pickOneWeightedIntention: function (weightedIntentions) {
      // We could set sizes to one if we don't want the number of elements of influence chances of being picked
      for (var i = 0; i < weightedIntentions.length; i++) {
        weightedIntentions[i].size = weightedIntentions[i].texts.length;
      }
      // Choose one of the text lists
      return randomHelperSvc.weightedRandom(weightedIntentions);
    },
    pickOneTextFromTextList:function(textList) {
      // Each text will have size==1 and weight == 1 by default
      return randomHelperSvc.weightedRandom(textList);
    },
    pickOneTextFromWeightedIntentionArray: function (weightedIntentions) {
      var chosenTexts = service.pickOneWeightedIntention(weightedIntentions).texts;
      var chosenText  = service.pickOneTextFromTextList(chosenTexts);
    }


};

  return service;
}]);