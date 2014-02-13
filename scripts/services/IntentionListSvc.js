// Get a list of Intentions for a given area
cherryApp.factory('Intentions',  ['intentionApi', function (intentionApi) {
  var o = {};

  // Items from the most recent query
  o.intentions = [];
    // One cached intention list per areaId
  o.intentionArrays = {};

  // Query from the server : returns cached data if available !
    o.query = function (thendo, areaName ) {
    var queryCompleteList = true;

      // Return cached intentions for this area if available
      if (o.intentionArrays[areaName] !== undefined) {
        thendo(o.intentionArrays[areaName]);
        console.log("Intentions for AREA" + areaName + " read from cache");
        return;
      }

      intentionApi.forArea(areaName).then(function(intensionList) {
        // Memorize value
        o.intentions = reorderWithSortBy(intensionList);

        // New : cache the intentions in case we cannot retrieve it next time
        if ( queryCompleteList )
          o.intentionArrays[areaName] = o.intentions;
          // Do additionnal stuff for the caller, typically set a scope variable
          thendo(o.intentions);
      }, function (response) {
        console.log("-- bad request -- " + url);
        console.log(response.status + "*");
      });
  };

  // Cached intention from the last query
  o.lastQuery = function () {
    return o.intentions;
  };

  return o;
}]);

var reorderWithSortBy = function(intentions) {
    intentions.sort(
        function (a, b) {
            return (a.SortOrder - b.SortOrder);
        });
    return intentions;
};


