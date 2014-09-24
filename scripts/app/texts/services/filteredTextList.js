angular.module('app/texts/filteredTextListSvc', [])


.factory('filteredTextListSvc', [ 'helperSvc','filtersSvc','minSortOrderToBeRandomized','filteredTextsHelperSvc',
function(  helperSvc,filtersSvc,minSortOrderToBeRandomized,filteredTextsHelperSvc) {
  var filteredTextList = [];
  var styleCount = {};
  var propertyCount = {};

  var propertyKeystoBeCounted = [
    { name:'Target', value: 'H'},{ name:'Target', value: 'F'}, { name:'Target', value: 'P'},
    { name:'PoliteForm', value: 'T'},{ name:'PoliteForm', value: 'V'},
    { name:'Proximity', value: 'P'},{ name:'Proximity', value: 'D'}
  ] ;

  function countTextsForStylesAndProperties () {
    styleCount = helperSvc.countNbTextsPerStyle(filteredTextList);

    angular.forEach(propertyKeystoBeCounted, function (o) {
      var c = helperSvc.countNbTextsPerPropertyValue(filteredTextList, o.name, o.value);
      var key = o.name + '.' + o.value;
      propertyCount[key] = c;
    });
  }

  var service = {
    getTextCountForTagId: function(tagId) {
      return styleCount[tagId];
    },
    getTextCountForPropertyValue: function(propertyName, propertyValue) {
      return propertyCount[propertyName+'.'+ propertyValue];
    },

    setFilteredAndOrderedList: function (textList, currentUser, preferredStyles) {


      var filteredTextList2 = filteredTextsHelperSvc.getFilteredAndOrderedList(textList, currentUser, preferredStyles,filtersSvc.getCurrentFilters());

      filteredTextList = filteredTextList2;
      countTextsForStylesAndProperties();
      return filteredTextList;
    },
    getFilteredTextList: function() {
      return filteredTextList;
    },
    getLength: function() {
      return filteredTextList.length;
    }

  };
  return service;
}]);