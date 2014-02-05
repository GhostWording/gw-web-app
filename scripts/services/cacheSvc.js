// A simple wrapper around window.localStorage
cherryApp.factory('localStorage', ['$window', function($window) {
  return {
    get: function(key) {
      return $window.localStorage.getItem(key);
    },
    set: function(key, value) {
      if ( value ) {
        return $window.localStorage.setItem(key, value);
      } else {
        $window.localStorage.removeItem(key);
      }
    }
  };
}]);

// A cache that stores in-memory, then localStorage then calls externally
cherryApp.factory('cacheSvc', ['localStorage', '$q', function(localStorage, $q) {
  var cache = {};
  var cacheSvc = {
    _cache: cache,
    register: function(name, getFn) {
      cache[name] = {
        name: name,
        getFn: getFn
      };
    },

    update: function(name, lastChange) {
      var cacheEntry = cache[name];
      if ( !cacheEntry.lastChange || cacheEntry.lastChange < lastChange ) {
        delete cacheEntry.promise;
        localStorage.set(cacheEntry.key, null);
        cacheEntry.lastChange = lastChange;
      }
    },

    get: function(name, getFn) {
      var cacheEntry = cache[name] || cacheSvc.register(name, getFn);
      if ( !cacheEntry.promise ) {
        // We don't have a promise for the data
        
        // First try local storage
        var localValue = localStorage.get(name);
        if ( localValue ) {
          cacheEntry.promise = $q.when(localValue);
        }

        // Not in local storage so use the registered function to get it
        else {
          cacheEntry.promise = $q.when(cacheEntry.getFn());

          // Then when the data arrives add it to localStorage
          cacheEntry.promise.then(function(value) {
            localStorage.set(name, value);
          });
        }
      }
      return cacheEntry.promise;
    }
  };
  return cacheSvc;
}]);