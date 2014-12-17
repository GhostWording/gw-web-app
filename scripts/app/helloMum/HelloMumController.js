angular.module('app/helloMum/HelloMumController', [])
.controller('HelloMumController', ['$scope','currentLanguage','$q','helloMumSvc',
function($scope, currentLanguage,$q,helloMumSvc) {
  // TODO : if we know the user gender, we should set it before calling filtering functions (or use a watch to refilter)
  //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male
  // TODO : add mechanism to check for cache staleness somewhere in the app

  // Get slugs and default weights for hello mum intentions (
  var weightedIntentions = helloMumSvc.intentionDefaultWeights();

  // TODO : adjust intention userWeight properties according to user choice (none, few, many)
  // .....

  // Set intention weights = defaultWeight * userWeight
  helloMumSvc.setIntentionWeights(weightedIntentions);

  // Get text list promises for the intentions (from cache if previously queried)

  currentLanguage.setLanguageCode('en',true); // Should be set when app initialize
  var textListPromises = helloMumSvc.textListPromises(weightedIntentions,currentLanguage.currentCulture());

  // Filter and pick texts
  $q.all(textListPromises).then(function (resolvedTextLists) {
    helloMumSvc.attachFilteredTextListsToWeightedIntentions(weightedIntentions,resolvedTextLists);

    // If we suppose that 'burnt' texts = texts previously disliked + texts previously sent + text previously ignored
    // Before we make a random choice, we could check that the number of burnt text
    // is not a large proportion of those available (for example nbBurnt < available * 0.70)
    // if so we could recycle (unBurn) those that have been previously ignored
    //var chosenText = chooseTextFromArrayOfTextList(chosenTexts);

//    var chosenTexts = helloMumSvc.pickOneWeightedIntention(weightedIntentions).texts;
//    var chosenText = helloMumSvc.pickOneTextFromTextList(chosenTexts);
    var chosenText = helloMumSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
    console.log(chosenText);

    // TODO : if chosen text is burnt, require another one instead
  });


}]);

