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
      // It would be nice to provide lastChange instead of -1 at this point but we don't have it
      var valret = cacheSvc.get('areas.' + areaName, -1, function() {
        return serverSvc.get(areaName); });
      return valret;
    },

    // Invalidate cache if server version is newer : the area will only be refreshed on next call to getArea. Returns true if intentions should be reloaded
    invalidateCacheIfNewerServerVersionExists: function(areaName) {
      // Get the server version
      return serverSvc.get(areaName).then(function(areaFromServer) {
        return service.getArea(areaName).then(function(areaFromCache) {
          var valret = false;
          // compare version with the cache
          if ( areaFromCache && areaFromCache.LastChangeTime != areaFromServer.LastChangeTime ) {
            // If different, reset area object and list of intentions for area
            cacheSvc.reInitializeCacheEntry('areas.' + areaName);
            cacheSvc.reInitializeCacheEntry('intentions.' + areaName);
            valret = true;
          }
          return valret;
        })
      });
    }

  };

  return service;
}]);
