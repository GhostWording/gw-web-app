angular.module('app/intentions', ['app/areas', 'common/services/cache', 'common/services/server'])

// This service provides promises to intentions for the application.
// It uses the cache or requests from the server
.factory('intentionsSvc', ['$q', '$route', 'areasSvc', 'cacheSvc', 'serverSvc', function($q, $route, areasSvc, cacheSvc, serverSvc) {
  var service = {

    getCurrentId: function() {
      return $route.current && $route.current.params.intentionId;
    },

    getCurrent: function() {
      var currentIntentionId = service.getCurrentId();
      return areasSvc.getCurrent().then(function(currentArea) {
        if ( currentArea ) {
          return service.getIntention(currentArea.Name, currentIntentionId);
        }
      });
    },

    getForArea: function(areaName) {
      return cacheSvc.get('intentions.' + areaName, -1, function() {
        return serverSvc.get(areaName + '/intentions').then(function(intentions) {
            // Sort the intentions by the SortOrder property
            intentions.sort(function (a, b) {
                return (a.SortOrder - b.SortOrder);
            });
            return intentions;
        });
      });
    },

    getIntention: function(areaName, intentionId) {
      return cacheSvc.get('intentions.' + areaName + '.' + intentionId, -1, function() {
        return serverSvc.get(areaName + '/intention/' + intentionId);
      });
    },

  };

  return service;
}])

.controller('NewIntentionListController', ['$scope', 'currentArea', 'intentionsSvc', function($scope, currentArea, intentionsSvc) {

  var groupItems = function(items, columns) {
    var rows = [];
    while(items.length>0) {
      rows.push(items.splice(0,columns));
    }
    return rows;
  };

  // Choose title according to areaId : TODO : move to localisation service
  var AREA_PAGE_TITLE = {
    "Friends" : "Dites-le aux amis",
    "LoveLife" : "Dites-lui !",
    "Family" : "Dites-leur !",
    "DayToDay" : "Vie quotidienne",
    "Sentimental" : "Vie sentimentale",
    "Important" : "Occasions spéciales", // événements notables, saillants, singulier
    "Formalities" : "Expédiez les formalités !",
  };
  $scope.pageTitle = AREA_PAGE_TITLE[currentArea.Name];
  if ( !$scope.pageTitle ) {
    $scope.pageTitle = "Dites le !";
    console.log("Unknown area : ", currentArea);
  }


  $scope.currentArea = currentArea;

  // Get the intentions - it may be possible to move this to the resolve section of the route
  intentionsSvc.getForArea(currentArea.Name).then(function(intentions) {
    var ITEMS_PER_ROW = 3;
    $scope.groupedIntentions = groupItems(intentions, ITEMS_PER_ROW);
  });

}]);
