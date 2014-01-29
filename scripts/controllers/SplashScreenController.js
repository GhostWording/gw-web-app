// Display general information about our App
cherryApp.controller('SplashScreenController', ['$scope', 'HelperService','PostActionSvc',
    function ($scope, HelperService,PostActionSvc) {

        $scope.PostBox = PostActionSvc;

    }]);