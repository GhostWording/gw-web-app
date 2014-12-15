angular.module('app/helloMum/HelloMumController', [])
.controller('HelloMumController', ['$scope','currentLanguage','$q','helloMumSvc',
function($scope, currentLanguage,$q,helloMumSvc) {

  // Get the qualified slugs of the hello mum intentions
  var arrayOfIntentionsWithTexts = helloMumSvc.getQualifiedIntentionsSlugs();

  // TODO : adjust intention userWeight properties according to user preferences (none, few, many)
  // .....

  // Calculate weight of each intention according to defaultWeight and userWeight
  arrayOfIntentionsWithTexts = helloMumSvc.calculateWeight(arrayOfIntentionsWithTexts);

  // Get promises for each text list (from cache if previously queried)
  // TODO : add mechanism to check for cache staleness
  var culture = currentLanguage.currentCulture(); // could just use 'en-GB' instead
  var arrayOfPromises = helloMumSvc.getPromisesForTextLists(arrayOfIntentionsWithTexts,culture);

  // When all promises are resolved
  $q.all(arrayOfPromises).then(function (resolvedTextLists) {

    //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male

    var nbFilteredTexts = 0;  var nbTextsForIntentions = 0;
    for (var i = 0; i < arrayOfIntentionsWithTexts.length; i++) {
      // Keep texts with relationType == Parent, recipientGender == F
      var texts = resolvedTextLists[i];
      var filteredText = helloMumSvc.filterTextsForMother(texts);
      arrayOfIntentionsWithTexts[i].texts = filteredText;

      console.log(arrayOfIntentionsWithTexts[i].name + ' ' + texts.length + ' ' + filteredText.length);
      nbFilteredTexts += filteredText.length;   nbTextsForIntentions += texts.length;
    }
    console.log("------ TOTAL : " + nbTextsForIntentions);  console.log("------ TOTAL FILTERED : " + nbFilteredTexts);

    // TODO : also filter for sender gender and closeness

    // If we suppose that 'burnt' texts = texts previously disliked + texts previously sent + text previously ignored
    // Before we make a random choice, we could check that the number of burnt text
    // is not a large proportion of those available (for example nbBurnt < available * 0.70)
    // if so we could recycle (unBurn) those that have been previously ignored
    //var chosenText = chooseTextFromArrayOfTextList(chosenTexts);

    var chosenTexts = helloMumSvc.pickOneArrayOfTextArrays(arrayOfIntentionsWithTexts).texts;
    var chosenText = helloMumSvc.pickOneTextInArray(chosenTexts);
    console.log(chosenText);

    // TODO : if chosen text is burnt, require another one instead
  });


}]);

