// Display buttons to acces text style options
cherryApp.controller('StyleBarController', ['$scope','FilterVisibilityHelperSvc','TheTexts',function ($scope,FilterVisibilityHelperSvc,TheTexts) {

    // Filtering options only be offered to users if they are revelant for the current text list
    $scope.choseStyleFiltersToDisplay = function() {
        FilterVisibilityHelperSvc.setContextFiltersVisibility(TheTexts.getAllTexts());
        $('#modalFiltres').modal('show');
    };

}]);