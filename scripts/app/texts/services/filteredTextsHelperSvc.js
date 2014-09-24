angular.module('app/texts/filteredTextsHelperSvc', [])


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
  }]);