// Shows total number of filtered texts plus localized label
cherryApp.controller('ProgressBarController', ['$scope','TheTexts', function ($scope,TheTexts) {

    $scope.showProgressBar = function() {
        return TheTexts.texts.length == 0;
    };

    $scope.progressBarWidth = function() {
        if ( TheTexts.texts.length == 0 )
            return 60;
        else
            return 100;
    };

}]);