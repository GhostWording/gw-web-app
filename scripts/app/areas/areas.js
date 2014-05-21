angular.module('app/areas', ['common/services/cache', 'common/services/server'])


// This service provides promises to areas for the application.
// It uses the cache or requests from the server
.factory('areasSvc', ['$q', '$route', 'cacheSvc', 'serverSvc', function($q, $route, cacheSvc, serverSvc) {
  var service = {

    getCurrentName: function() {
      return $route.current && ($route.current.params.areaName || $route.current.params.areaId);
    },

    getCurrent: function() {
      var currentAreaName = service.getCurrentName();
      if ( currentAreaName ) {
        return service.getArea(currentAreaName);
      } else {
        return $q.when(null);
      }
    },

    getAll: function() {
      return cacheSvc.get('areas._all', -1, function() {
        return serverSvc.get('areas');
      });
    },


    getArea: function(areaName) {
      return cacheSvc.get('areas.' + areaName, -1, function() { return serverSvc.get(areaName); });
    }
  };

  return service;
}]);
