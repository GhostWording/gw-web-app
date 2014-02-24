angular.module('app/texts/TextListController', [])

// Displays a list of texts
.controller('TextListController',
 ['$scope', 'textListSvc', 'currentIntention', 'currentArea', 'filtersSvc',
function ($scope, textListSvc, currentIntention, currentArea, filtersSvc) {

    $scope.filters = filtersSvc.filters;
    $scope.currentArea = currentArea;
    $scope.currentIntention = currentIntention;

    function updateFilteredList() {
      $scope.filteredList = filtersSvc.filterList($scope.textList);
    }

    textListSvc.getTextList(currentArea.Name, currentIntention.IntentionId).then(function(textList) {
      $scope.textList = textList;
      updateFilteredList();
    });

    $scope.$watch(function() { return $scope.filters; }, updateFilteredList);

    $scope.filtersWellDefined = filtersSvc.wellDefined;
}]);