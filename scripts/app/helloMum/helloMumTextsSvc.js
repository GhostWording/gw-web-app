angular.module('app/helloMum/helloMumTextsSvc', [])

.factory('helloMumTextsSvc', ['textsSvc', 'filterHelperSvc', 'currentUser',
function (textsSvc, filterHelperSvc, currentUser) {

var service = {

  setUserGender: function (gender) {
      if (gender == 'F' || gender == 'H') // H for Homme for Male
        currentUser.gender = gender;
    },
    createMotherFilter: function () {
      var filters = filterHelperSvc.createEmptyFilters();
      // Set relation type to parent
      filterHelperSvc.setRecipientTypeTag(filters, '64C63D');
      // Set recipient gender
      filterHelperSvc.setRecipientGender(filters, 'F'); // or 'H' for man
      return filters;
    },
    filterTextsForMother: function (texts) {
      var filters = service.createMotherFilter();
      // currentUser will have all properties to default unless you set one.
      return  filterHelperSvc.getFilteredList(texts, currentUser, filters);
    },

    textListPromises: function (arr, culture) {
      var textListPromises = [];
      for (var i = 0; i < arr.length; i++) {
        // TODO : when we have the API for that, we can add relation type to the parameters
        var p = textsSvc.getTextList('HelloMum', arr[i].name, culture, true, false);
        textListPromises.push(p);
      }
      return textListPromises;
    },

    attachFilteredTextListsToWeightedIntentions: function (weightedIntentions, resolvedTextLists) {
      //var nbFilteredTexts = 0; var nbTextsForIntentions = 0;
      for (var i = 0; i < weightedIntentions.length; i++) {
        var texts = resolvedTextLists[i];
        var filteredText = service.filterTextsForMother(texts);
        //console.log(weightedIntentions[i].name + ' ' + texts.length + ' ' + filteredText.length);
        weightedIntentions[i].texts = filteredText;
        //nbFilteredTexts += filteredText.length; nbTextsForIntentions += texts.length;
      }
    // console.log("------ TOTAL : " + nbTextsForIntentions);  console.log("------ TOTAL FILTERED : " + nbFilteredTexts);
    }

  };

return service;
}])
;