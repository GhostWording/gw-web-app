angular.module('app/userDashboard/BoardPosterDebugController', [])
.controller('BoardPosterDebugController', ['$scope', 'currentBoardPosterSvc',
  function ($scope, currentBoardPosterSvc) {

    $scope.$watch(function() { return currentBoardPosterSvc.getCurrentPoster();}, function(poster) {
      if ( !!poster ) {
        $scope.filteredMessageList = poster.filteredTextList;
        $scope.debugTextList = poster.fullTextList;
      }
    },true);

  }]);
