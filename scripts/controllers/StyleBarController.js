// Display buttons to acces text style options
cherryApp.controller('StyleBarController', ['$scope','FilterVisibilityHelperSvc','CurrentTextList',function ($scope,FilterVisibilityHelperSvc,CurrentTextList) {

    // Filtering options only be offered to users if they are revelant for the current text list
    $scope.choseStyleFiltersToDisplay = function() {
        //FilterVisibilityHelperSvc.setContextFiltersVisibility(TheTexts.getAllTexts());
        FilterVisibilityHelperSvc.setContextFiltersVisibility(CurrentTextList.getCompleteTextListForIntention());
        $('#modalFiltres').modal('show');
    };

}]);