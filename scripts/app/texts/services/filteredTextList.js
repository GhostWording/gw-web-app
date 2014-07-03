angular.module('app/texts/filteredTextListSvc', [])

.factory('filteredTextListSvc', ['areasSvc', 'intentionsSvc', '$stateChange', 'cacheSvc', 'serverSvc','HelperSvc','currentLanguage','filtersSvc','minSortOrderToBeRandomized','generalStyles',
function(areasSvc, intentionsSvc, $stateChange, cacheSvc, serverSvc,HelperSvc,currentLanguage,filtersSvc,minSortOrderToBeRandomized,generalStyles) {
  var filteredTextList = [];

  var styleCount = {};

  function countTextsPerStyle () {
    styleCount = {};
    var nbHumorous = 0;
    function countTag (tagId) {
      if ( !styleCount[tagId] )
        styleCount[tagId] = 0;
      styleCount[tagId]++;
    }
    // Add back in texts that are compatible with the current filters
    angular.forEach(filteredTextList, function (text) {
      for ( var i = 0; i < text.TagIds.length; i++) {
        var tagId = text.TagIds[i];
        countTag(text.TagIds[i]);
      }
    });
    //console.log('TextsBis with humour : ' + styleCount['43AC3B']);
  }

  var service = {

    // If a tag is present in half the texts, it greatly helps with the selection
    // the closer we are to 0.5, the better the score
    countTagSelelectiveness: function (tagId) {
      var nbTotal = service.getLength();
      if (nbTotal === 0)
        return -1;
      // Are we far from midpoint ?
      var styleCount = service.getTextCountForTagId(tagId);
      var distanceToMidpoint = styleCount - (nbTotal / 2);
      if (distanceToMidpoint < 0 )
        distanceToMidpoint = -distanceToMidpoint;
      var relativeDistanceToMidpoint = distanceToMidpoint / (nbTotal / 2);
      var selectiveness = 1 - relativeDistanceToMidpoint ;
      //console.log ("styleCount . distanceToMidpoint . selectiveness : " + styleCount + ' . ' + distanceToMidpoint + ' . ' + selectiveness);
      return selectiveness;
    },
    countStyleSelelectiveness: function(name) {
      var style = generalStyles.stylesByName[name];
      if (!style )
        return -1;
      return service.countTagSelelectiveness(style.id);
    },
    getTextCountForTagId: function(tagId) {
//      console.log('Texts with tag ' + tagId + ' : ' + styleCount[tagId]);
      return styleCount[tagId];
    },
    getTextCountForStyleName: function(name) {
      var style = generalStyles.stylesByName[name];
      return service.getTextCountForTagId(style.id);
    },

    setFilteredAndOrderedList: function (textList, currentUser, preferredStyles) {

      var filteredList = [];
      // A map used to count the number of matching styles indexed by text id
      var matchingStylesMap = {};
      // Add back in texts that are compatible with the current filters
      angular.forEach(textList, function (text) {
        if (filtersSvc.textCompatible(text, currentUser)) {
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
      filteredTextList = filteredList;
      countTextsPerStyle();
      return filteredList;
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