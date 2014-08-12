angular.module('app/userDashboard/currentBoardPosterSvc', [])

.factory('currentBoardPosterSvc', ['boardPosterHelperSvc',function (boardPosterHelperSvc) {

  var currentPoster = null;

  var service = {
    setCurrentPoster : function(poster) {
      currentPoster = poster;
      //console.log(currentPoster);
    },
    getCurrentPoster: function() {
      return currentPoster;
    }

  };

  return service;
}]);

