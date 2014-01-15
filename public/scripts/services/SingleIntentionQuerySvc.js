﻿// Gets an intention for a given intentionID
cherryApp.factory('SingleIntentionQuerySvc', ['$http','AppUrlSvc', function ($http, AppUrlSvc) {

    var o = {};

    o.query = function (id, areaId,doIfIntentionRead) {
        // Read intention from cache or server then call doIfIntentionReadSuccessfullyFromServerOrCache;
//        var url = AppUrlSvc.getApiIntentionRoot(id);
        var url = AppUrlSvc.urlIntentionFromId(id,areaId);
        $http.get(url)
        $http({method: 'GET',cache:false,url: url, headers: {"Accept-Language":"fr-FR"}
        })
            .success(function (data, status) {
                console.log(status + "*" + " " + url);
                doIfIntentionRead(data);
            })
            .error(function (data, status) {
                console.log("-- bad request -- " + url);
                console.log(status + "*");
            });
    };

    return o;
}]);