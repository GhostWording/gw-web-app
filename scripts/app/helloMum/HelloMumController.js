/**
 * Created by Administrator on 14/12/14.
 */
angular.module('app/helloMum/HelloMumController', [])
.controller('HelloMumController', ['$scope','randomHelperSvc','textsSvc','currentLanguage','$q',
function($scope,randomHelperSvc,textsSvc,currentLanguage,$q) {

  // I-think-of-you  jokes  thank-you  would-you-care-for-a-drink  a-few-words-for-you  how-are-you  I-love-you   I-miss-you  I-am-here-for-you  facebook-status  positive-thoughts

  // intention defaultWeight : will be 1 by default, between 0 and 1 if we feel that an intention might contain too many text
  // intention userWeight : will be 0, 1 or 4 if users chooses none, few or many for this intention
  var arr = [
    { name:'I-think-of-you', defaultWeight:1,   userWeight:1 },
    { name:'jokes',          defaultWeight:0.5, userWeight:1 },
    { name:'how-are-you',    defaultWeight:1,   userWeight:1 }
  ];
  // Calculate weight
  for (var i=0; i< arr.length; i++) {
    arr[i].weight = arr[i].defaultWeight * arr[i].userWeight;
  }

  // Get promises for each text list (from cache if previously queried)
  // TODO : add mechanism to check for cache staleness
  var textListPromises = [];
  for (i=0; i< arr.length; i++) {
    // TODO : when we have the API for that, we can add relation type to the parameters
    var p = textsSvc.getTextList('HelloMum',arr[i].name,currentLanguage.currentCulture(),true,false);
    textListPromises.push(p);
  }

  // Move to common
  function chooseTextFromArrayOfTextList(arr) {
    // Add size information to each text list
    for (var i = 0; i < arr.length; i++) {
      arr[i].size = arr[i].texts.length;
      console.log(arr[i].name + ' ' + arr[i].size);
    }

    // First pick  list
    var chosenList = randomHelperSvc.weightedRandom(arr);
    // Then pick text in list
    var texts = chosenList.texts;
    var chosenText = randomHelperSvc.weightedRandom(texts);
    return chosenText;
  }

  // When all promises are resolved
  $q.all(textListPromises).then(function (arrayOfTextList) {

    for (var i = 0; i < arr.length; i++) {
      // Get resolved promises
      arr[i].texts = arrayOfTextList[i];
      // TODO : only keep texts matching relation type == Parent, recipient gender == F
      // TODO : also filter for sender gender and closeness
    }


    // If we suppose that 'burnt' texts = texts previously disliked + texts previously sent + text previously ignored
    // Before we make a random choice, we could check that the number of burnt text
    // is not a large proportion of those available (for example nbBurnt < available * 0.70)
    // if so we could recycle (unBurn) those that have been previously ignored
    var chosenText = chooseTextFromArrayOfTextList(arr);
    // TODO : if chosen text is burnt, require another one
    console.log(chosenText);
  });


}]);

