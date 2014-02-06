// Shows total number of filtered texts plus localized label
cherryApp.controller('ProgressBarController', ['$scope','TheTexts','CurrentTextList', function ($scope,TheTexts,CurrentTextList) {

    $scope.showProgressBar = function() {
        //return TheTexts.texts.length == 0;
        var showBar = CurrentTextList.getCurrentTextList() === undefined;
        return showBar;
    };

    $scope.progressBarWidth = function() {
        if ( TheTexts.texts.length == 0 )
            return 60;
        else
            return 100;
    };

}]);