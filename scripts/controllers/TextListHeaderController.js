// Shows total number of filtered texts plus localized label
cherryApp.controller('TextListHeaderController', ['$scope','NormalTextFilters', 'CurrentTextList', function ($scope,TextFilters,CurrentTextList) {

    $scope.showHeader = function () {
        var v = !TextFilters.recipientFiltersFullyDefined();
        return v;
    };

    $scope.showNbTexts = function() {
        //return TheTexts.hasFilteredTexts();
        return CurrentTextList.hasTexts();
    };

    $scope.nbTexts = function() {
        //var nbTexts = TheTexts.filteredTexts.length;
        //return nbTexts > 0 ? nbTexts : "" ;
        CurrentTextList.getNbTexts();
    };

    $scope.nbTextsLabel = function() {
        var nbTexts = CurrentTextList.getNbTexts();
        return nbTexts > 0 ? "façons de dire" : "Aucun texte pour dire" ;
    };

//    $scope.o = {};
//    $scope.o.filteredTexts = TheTexts.filteredTexts;

}]);