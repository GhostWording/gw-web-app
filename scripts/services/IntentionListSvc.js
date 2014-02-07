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




// Fake (static) Intentions
cherryApp.factory('FakeIntentions', function () {
  var intentionFactory = {};
  //intentionFactory.trierPar = 'Id';

  intentionFactory.intentions = [];

  intentionFactory.query = function (thendo) {
    var data = [
      { Id: "28033DDD-F628-409E-AAB6-6A6A51668388", Label: "Merci !" },
      { Id: "139789E2-37FA-444F-8DBC-170BCECF79E9", Label: "J'aimerais vous revoir" },
      { Id: "3CBB20CC-699D-4528-8D16-746DBE14FE31", Label: "Je pense à  toi.." },
      { Id: "A8694354-345C-4963-B033-AE60FBF408E5", Label: "Bon anniversaire" },
      { Id: "1AD550C9-6EEC-4497-83FC-4C60CDFFB324", Label: "Je suis en retard" },
      { Id: "A6E4DF0D-4C40-4C1B-A56B-921651FC91F6", Label: "Surprends-moi" },
      { Id: "51B0DEC7-D3E9-472C-82C7-3B6D68C8DD8B", Label: "J'ai envie de toi" }];
    //var filteredIntentions = filterIntentions(data);
    // Memorize value
    intentionFactory.intentions = filterIntentions(data);

    thendo(intentionFactory.intentions); // typiquement affecter les intention à une variable du scope
    return intentionFactory.intentions;
  };

  intentionFactory.lastQuery = function () {
    return intentionFactory.intentions;
  };

  return intentionFactory;
});