angular.module('app/texts/filteredTextListSvc', [])


.factory('filteredTextsHelperSvc', ['minSortOrderToBeRandomized','filterHelperSvc',
  function( minSortOrderToBeRandomized,filterHelperSvc) {

    var service = {
      getFilteredAndOrderedList: function (textList, currentUser, preferredStyles,filters) {

        var filteredList = [];
        // A map used to count the number of matching styles indexed by text id
        var matchingStylesMap = {};
        // Add back in texts that are compatible with the current filters
        angular.forEach(textList, function (text) {
          if (filterHelperSvc.textCompatible(text, currentUser,filters)) {
            // Add to filtered list
            filteredList.push(text);
            var tagIds = angular.copy(text.TagIds); // We may need to copy that in case it modifies the original tag list ????
            matchingStylesMap[text.TextId] = preferredStyles.filterStyles(tagIds);
          }
        });

        // If there are no preferred style we don't want to perturbate ordering at all
        if (preferredStyles.stylesList.length > 0) {
          // Sort by number of matching preferred styles first
          filteredList.sort(function (text1, text2) {
            var count1 = matchingStylesMap[text1.TextId].stylesList.length * 100;
            var count2 = matchingStylesMap[text2.TextId].stylesList.length * 100;
            var retval = count2 - count1;
            // If texts score the same as far as styles go, use SortBy, but only if the are not meant to be randomized
            if (count1 == count2 && ( text1.SortBy < minSortOrderToBeRandomized || text2.SortBy < minSortOrderToBeRandomized  ))
              retval = -(text2.SortBy - text1.SortBy);
            return retval;
          });
        }
        return filteredList;
      }

    };
    return service;
  }])

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

//      var filteredList = [];
//      // A map used to count the number of matching styles indexed by text id
//      var matchingStylesMap = {};
//      // Add back in texts that are compatible with the current filters
//      angular.forEach(textList, function (text) {
//        if (filtersSvc.textCompatible(text, currentUser)) {
//          // Add to filtered list
//          filteredList.push(text);
//          var tagIds = angular.copy(text.TagIds); // We may need to copy that in case it modifies the original tag list ????
//          matchingStylesMap[text.TextId] = preferredStyles.filterStyles(tagIds);
//        }
//      });
//
//      // If there are no preferred style we don't want to perturbate ordering at all
//      if (preferredStyles.stylesList.length > 0) {
//        // Sort by number of matching preferred styles first
//        filteredList.sort(function (text1, text2) {
//          var count1 = matchingStylesMap[text1.TextId].stylesList.length * 100;
//          var count2 = matchingStylesMap[text2.TextId].stylesList.length * 100;
//          var retval = count2 - count1;
//          // If texts score the same as far as styles go, use SortBy, but only if the are not meant to be randomized
//          if (count1 == count2 && ( text1.SortBy < minSortOrderToBeRandomized || text2.SortBy < minSortOrderToBeRandomized  ))
//            retval = -(text2.SortBy - text1.SortBy);
//          return retval;
//        });
//      }

      var filteredTextList2 = filteredTextsHelperSvc.getFilteredAndOrderedList(textList, currentUser, preferredStyles,filtersSvc.getCurrentFilters());

//      console.log("filteredTextList.length : " + filteredList.length);
//      console.log("filteredTextList2.length : " + filteredTextList2.length);

//      filteredTextList = filteredList;

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