// Shows total number of filtered texts plus localized label
cherryApp.controller('TextListHeaderController', ['$scope','NormalTextFilters', 'TheTexts', function ($scope,TextFilters,TheTexts) {

    $scope.showHeader = function () {
        var v = !TextFilters.recipientFiltersFullyDefined();
        return v;
    };

    $scope.showNbTexts = function() {
        return TheTexts.hasFilteredTexts();
    };

    $scope.nbTexts = function() {
        var nbTexts = TheTexts.filteredTexts.length;
        return nbTexts > 0 ? nbTexts : "" ;
    };

    $scope.nbTextsLabel = function() {
        var nbTexts = TheTexts.filteredTexts.length;
        return nbTexts > 0 ? "façons de dire" : "Aucun texte pour dire" ;
    };

    $scope.o = {};
    $scope.o.filteredTexts = TheTexts.filteredTexts;

}]);