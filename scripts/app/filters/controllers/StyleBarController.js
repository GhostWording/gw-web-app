angular.module('app/filters/StyleBarController', [])

// Display buttons to access text style options
.controller('StyleBarController', ['$scope',function ($scope) {

    // Filtering options only be offered to users if they are revelant for the current text list
    $scope.showStyleFilters = function() {

        // //FilterVisibilityHelperSvc.setContextFiltersVisibility(TheTexts.getAllTexts());
        // FilterVisibilityHelperSvc.setContextFiltersVisibility(CurrentTextList.getCompleteTextListForIntention());
        // $('#modalFiltres').modal('show');
    };

}]);