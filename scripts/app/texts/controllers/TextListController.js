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

      // Add back in texts that are compatible with the current filters
      angular.forEach($scope.textList, function(text) {
        if ( filtersSvc.textCompatible(text, currentUser) ) {
          $scope.filteredList.push(text);
        }
      });

    };

    // Watch the filters and update the filtered text list if they change
    $scope.$watch(function() { return filtersSvc.filters; }, $scope.filterList, true);

}]);