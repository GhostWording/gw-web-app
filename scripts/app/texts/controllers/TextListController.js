angular.module('app/texts/TextListController', [])

// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentIntention', 'currentArea', 'currentUser', 'filtersSvc',
function ($scope, currentTextList, currentIntention, currentArea, currentUser, filtersSvc) {

    $scope.currentArea = currentArea;
    $scope.currentIntention = currentIntention;
    $scope.textList = currentTextList;
    $scope.filteredList = [];

    $scope.filters = filtersSvc.filters;
    $scope.filtersWellDefined = filtersSvc.wellDefined;


    $scope.filterList = function() {
      
      // Clear the previous filter list
      $scope.filteredList.length = 0;

      // A map used to count the number of matching styles indexed by text id
      var matchingStylesMap = {};

      // Add back in texts that are compatible with the current filters
      angular.forEach($scope.textList, function(text) {
        if ( filtersSvc.textCompatible(text, currentUser) ) {
          $scope.filteredList.push(text);
          matchingStylesMap[text.TextId] = $scope.filters.preferredStyles.filterStyles(text.TagIds);
        }
      });

      // Sort by number of matching preferred styles first then by sortBy value
      $scope.filteredList.sort(function(text1,text2) {
        var count1 = matchingStylesMap[text1.TextId].stylesList.length;
        var count2 = matchingStylesMap[text2.TextId].stylesList.length;
        return (count1 != count2) ? count2 - count1 : text2.SortBy - text1.SortBy;
      });

    };

    // Watch the filters and update the filtered text list if they change
    $scope.$watch(function() { return filtersSvc.filters; }, $scope.filterList, true);

}]);