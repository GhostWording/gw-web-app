angular.module('app/helloMum/helloMumSvc', ['common/services/randomHelperSvc'])

.factory('helloMumSvc', ['randomHelperSvc','textsSvc','filterHelperSvc','currentUser',
function (randomHelperSvc,textsSvc,filterHelperSvc,currentUser) {

  var service = {

    // intention defaultWeight : will be 1 by default, between 0 and 1 if we feel that an intention might contain too many text
    // intention userWeight : will be 0, 1 or 4 if users chooses none, few or many for this intention
    getQualifiedIntentionsSlugs: function () {
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
        { name: 'positive-thoughts',   defaultWeight: 1,  userWeight: 1 },
        { name: 'would-you-care-for-a-drink', defaultWeight: 1,   userWeight: 1 },
      ];
    return arr;
    },

    calculateWeight: function(arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].weight = arr[i].defaultWeight * arr[i].userWeight;
      }
      return arr;
    },

    getPromisesForTextLists: function(arr,culture) {
      var textListPromises = [];
      for (var i=0; i< arr.length; i++) {
        // TODO : when we have the API for that, we can add relation type to the parameters
        var p = textsSvc.getTextList('HelloMum',arr[i].name,culture,true,false);
        textListPromises.push(p);
      }
      return textListPromises;
    },

    pickOneArrayOfTextArrays: function (arr) {
      // Add size information to each text list
      for (var i = 0; i < arr.length; i++) {
        arr[i].size = arr[i].texts.length;
        //console.log(arr[i].name + ' ' + arr[i].size);
      }
      // Choose one of the array
      var chosenArray = randomHelperSvc.weightedRandom(arr);
      return chosenArray;
    },

    pickOneTextInArray:function(textArray) {
      return randomHelperSvc.weightedRandom(textArray);
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
      var filteredTexts = filterHelperSvc.getFilteredList(texts, currentUser, filters);
      return filteredTexts;
    },
    setUserGender: function(gender) {
      if ( gender == 'F' || gender == 'H' ) // H for Homme for Male
        currentUser.gender = gender;
    }

};

  return service;
}]);