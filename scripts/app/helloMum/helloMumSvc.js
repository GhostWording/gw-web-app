angular.module('app/helloMum/helloMumSvc', ['common/services/randomHelperSvc'])

.factory('helloMumSvc', ['randomHelperSvc','textsSvc', function (randomHelperSvc,textsSvc) {

  var service = {

    // intention defaultWeight : will be 1 by default, between 0 and 1 if we feel that an intention might contain too many text
    // intention userWeight : will be 0, 1 or 4 if users chooses none, few or many for this intention
    getQualifiedIntentionsSlugs: function () {
      var arr = [
        { name: 'I-think-of-you',     defaultWeight: 1,   userWeight: 1 },
        { name: 'jokes',              defaultWeight: 0.5, userWeight: 1 },
        { name: 'how-are-you',        defaultWeight: 1,   userWeight: 1 },
        { name: 'thank-you',          defaultWeight: 1,   userWeight: 1 },
        { name: 'a-few-words-for-you',defaultWeight: 1,   userWeight: 1 },
        { name: 'I-love-you',         defaultWeight: 1,   userWeight: 1 },
        { name: 'I-miss-you',         defaultWeight: 1,   userWeight: 1 },
        { name: 'I-am-here-for-you',  defaultWeight: 0.5,   userWeight: 1 },
        { name: 'facebook-status',    defaultWeight: 0.5,   userWeight: 1 },
        { name: 'positive-thoughts',   defaultWeight: 1,   userWeight: 1 },
        { name: 'would-you-care-for-a-drink', defaultWeight: 0.5,   userWeight: 1 },
      ];
      // Calculate weight

    return arr;
    },
    calculateWeight: function(arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].weight = arr[i].defaultWeight * arr[i].userWeight;
      }
      return arr;
    },
    getTextArrayPromises: function(arr,culture) {
      var textListPromises = [];
      for (var i=0; i< arr.length; i++) {
        // TODO : when we have the API for that, we can add relation type to the parameters
        var p = textsSvc.getTextList('HelloMum',arr[i].name,culture,true,false);
        textListPromises.push(p);
      }
      return textListPromises;
    },
    PickOneArrayOfTextArrays: function (arr) {
      // Add size information to each text list
      for (var i = 0; i < arr.length; i++) {
        arr[i].size = arr[i].texts.length;
        console.log(arr[i].name + ' ' + arr[i].size);
      }
      // Choose one of the array
      var chosenArray = randomHelperSvc.weightedRandom(arr);
      return chosenArray;
    },
    PickOneTextInArray:function(textArray) {
      return randomHelperSvc.weightedRandom(textArray);
    }


};

  return service;
}]);