// Gets a list of Intentions for a given area
cherryApp.factory('Intentions',  ['$http','FakeIntentions','AppUrlSvc', function ($http,FakeIntentions,AppUrlSvc)     {
	var o = {};

	// Items from the most recent query
	o.intentions = [];
    // One cached intention list per areaId
	o.intentionArrays = {};

	// Query from the server : returns cached data if available !
//	o.query = function (thendo, areaId, nbIntentions ) {
    o.query = function (thendo, areaName ) {
		var queryCompleteList = false;

//		if (nbIntentions === undefined ) {
//			nbIntentions = 1000;
            queryCompleteList = true;
			// Return cached intentions for this area if available
			if (o.intentionArrays[areaName] !== undefined) {
				thendo(o.intentionArrays[areaName]);
				console.log("Intentions for AREA" + areaName + " read from cache");
				return;
			}
//		}

//		var url = AppUrlSvc.getApiRoot() +  "intentions.json?n=" + nbIntentions ;

        var url = AppUrlSvc.urlIntentions(areaName);
        $http({method: 'GET',cache:false,url: url,
               headers: {"Content-Type":"application/json","Accept-Language":"fr-FR"}
        })
            .success(function (data, status) {
				console.log(status + "*");
				// Memorize value
				//o.intentions = filterIntentions(data,areaId);
                o.intentions = reorderWithSortBy(data);

                // New : cache the intentions in case we cannot retrieve it next time
				if ( queryCompleteList )
					o.intentionArrays[areaName] = o.intentions;
				// Do additionnal stuff for the caller, typically set a scope variable
				thendo(o.intentions);
			})
			.error(function (data, status) {
				console.log("-- bad request -- " + url);
				console.log(status + "*");
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


//var filterIntentions = function (intentions, minNbTexts) {
//	var retval = [];
//	angular.forEach(intentions,
//		function (intention) {
////              if ( intention. === undefined )
//                    retval.push(intention);
//		});
//	return retval;
//}



// Keeps intentions concerned with areaId => should now be AreaName instead
//var filterIntentions = function (intentions, areaId) {
//	var retval = [];
//	//var orderedIntentions = $filter('orderBy')($scope.intentions,  $scope.trierPar);
//	//var orderedIntentions =  $filter('OrderByPremiereLettre')($scope.intentions,  $scope.trierPar);
//	//var orderedIntentions = intentions;
//
//	angular.forEach(intentions,
//		function (intention) {
////            if ( intention.Areas === undefined )
//              if ( intention.AreaIds === undefined )
//
//                    retval.push(intention);
//			else
//				PushIfValidArea(intention);
//		});
//	return retval;
//
//	function PushIfValidArea(intention) {
////		for (i = 0; i < intention.Areas.length; i += 1) {
//        for (i = 0; i < intention.AreaIds.length; i += 1) {
//
////			if (intention.Areas[i].AreaId == areaId) {
//            if (intention.AreaIds[i].AreaId == areaId) {
//                retval.push(intention);
//				//console.log(intention.Areas[i].AreaId);
//				break;
//			}
//		}
//	}
//};

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

