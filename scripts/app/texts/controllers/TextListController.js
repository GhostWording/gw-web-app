angular.module('app/texts/TextListController', [])

// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentIntention', 'currentArea', 'filtersSvc',
function ($scope, currentTextList, currentIntention, currentArea, filtersSvc) {

    $scope.currentArea = currentArea;
    $scope.currentIntention = currentIntention;
    $scope.textList = currentTextList;

    $scope.filters = filtersSvc.filters;
    $scope.filtersWellDefined = filtersSvc.wellDefined;

    $scope.$watch(function() { return filtersSvc.filters; }, function updateFilteredList() {
      $scope.filteredList = filtersSvc.filterList($scope.textList);
    });

}]);