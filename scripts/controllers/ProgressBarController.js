// Shows total number of filtered texts plus localized label
cherryApp.controller('ProgressBarController', ['$scope','CurrentTextList', function ($scope,CurrentTextList) {

    $scope.showProgressBar = function() {
        var showBar = CurrentTextList.getCurrentTextList() === undefined;
        return showBar;
    };

    $scope.progressBarWidth = function() {
        if ( !CurrentTextList.hasTexts())
            return 60;
        else
            return 100;
    };

}]);