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