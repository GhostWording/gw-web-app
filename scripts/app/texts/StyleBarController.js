angular.module('app/texts/StyleBarController', [])

// Display buttons to access text style options
.controller('StyleBarController', ['$scope','FilterVisibilityHelperSvc','currentTextList',function ($scope,FilterVisibilityHelperSvc,currentTextList) {

    // Filtering options only be offered to users if they are revelant for the current text list
    $scope.choseStyleFiltersToDisplay = function() {
        //FilterVisibilityHelperSvc.setContextFiltersVisibility(TheTexts.getAllTexts());
        FilterVisibilityHelperSvc.setContextFiltersVisibility(CurrentTextList.getCompleteTextListForIntention());
        $('#modalFiltres').modal('show');
    };

}]);