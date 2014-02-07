// A simple wrapper around window.localStorage
cherryApp.factory('localStorage', ['$window', function($window) {
  return {
    get: function(key) {
      return angular.fromJson($window.localStorage.getItem(key));
    },
    set: function(key, value) {
      if ( value ) {
        return $window.localStorage.setItem(key, angular.toJson(value));
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

    register: function(name, lastChange, getFn) {
      return cache[name] = {
        name: name,
        getFn: getFn,
        lastChange: lastChange
      };
    },

    update: function(name, lastChange) {
      var cacheEntry = cache[name];
      if ( cacheEntry ) {
        if ( cacheEntry.lastChange === undefined || cacheEntry.lastChange < 0) {
          cacheEntry.lastChange = lastChange;
        } else if ( cacheEntry.lastChange < lastChange ) {
          delete cacheEntry.promise;
          //localStorage.set(cacheEntry.key, null);
          localStorage.set(name, null);
           console.log("lastChange :" + lastChange + " for intention" + name + " DELETING cacheEntry.promise");
            cacheEntry.lastChange = lastChange;
        }
      }
    },

    get: function(name, lastChange, getFn, skipLocalStorage) {
      var cacheEntry = cache[name] || cacheSvc.register(name, lastChange, getFn);
        // We don't have a promise for the data
        if (!cacheEntry.promise) {
            // If caller does not want to use local storage, use the getFn
            if (skipLocalStorage ) {
                cacheEntry.promise = $q.when(cacheEntry.getFn());
            } else {
                // First try local storage
                var localValue = localStorage.get(name);
                if (localValue) {
                    cacheEntry.promise = $q.when(localValue);
                }
                // Not in local storage so use the registered function to get it
                else {
                    cacheEntry.promise = $q.when(cacheEntry.getFn());
                    // Then when the data arrives add it to localStorage
                    cacheEntry.promise.then(function (value) {
                        localStorage.set(name, value);
                    });
                }
            }
        }
      return cacheEntry.promise;
    }
  };
  return cacheSvc;
}]);