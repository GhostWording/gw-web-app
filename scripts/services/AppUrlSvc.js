// Helps builds relative or abolute urls to query the APIs
cherryApp.factory('AppUrlSvc', ['$location',function ($location) {


    var siteName = "api.cvd.io";

    var protocolPrefix = "http://";
    var root =  protocolPrefix + siteName;
    var apiRoot = root + "/api/";
	var relativeApiRoot = "/api/";

    var o = {};

    // Use the whole/real http adress or just a relative adress for local hosting
    o.getApiRoot = function () {
        if (true || $location.$$protocol == "file" || location.hostname == 'localhost') {
            return apiRoot;
        }
        else {
            return relativeApiRoot;
        }
    };
    o.getNewApiRoot = function () {
        if (true || $location.$$protocol == "file" || location.hostname == 'localhost')
            return apiRoot;
        else
            return relativeApiRoot;
    };

//    var newApiRoot = "http://api-cvd-dev.azurewebsites.net/";
    var newApiRoot = "http://api.cvd.io/";

    o.urlUserEvent = function() {
      return newApiRoot + "userevent";
    };

    o.urlIntentions = function(areaName) {
        return newApiRoot+areaName+"/intentions";
    };
    // Texts for an intention : Area is only provided for tracking purposes
    o.urlTextsForIntention = function(intentionId,areaName) {
        var url = newApiRoot+areaName+"/intention/"+intentionId+"/texts";
        return url;
    };
    // Single text from its id : Area is only provided for tracking purposes
    o.urlTextFromId = function(textId,areaName) {
        return newApiRoot + areaName + "/text/" + textId;
    };
    o.urlIntentionFromId = function(intentionId,areaName) {
        return newApiRoot + areaName + "/intention/" + intentionId;
    };

    // Such as http://sitename/api/intention/xxxxx/
	o.getApiIntentionRoot = function(intentionId) {
		return  o.getApiRoot() + "intention/" + intentionId + "/";
	};

	// Such as http://sitename/api/intention/xxxxx/text/yyyyy/
	o.getApiIntentionAndTextRoot = function(intentionId, textId) {
		return o.getApiIntentionRoot(intentionId) + "text/" + textId + "/";
	};

	// Such as http://api.cvd.io/api/text/0d1e83a6-db37-4200-a359-3a8e603089c3
//	var devSiteName = siteName;
//	o.getApiTextRoot = function(textId) {
//		return protocolPrefix + devSiteName + "/api/text/" + textId;
//	};

    return o;
}]);