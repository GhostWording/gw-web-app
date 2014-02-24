// Keeps track of the currently selected text

cherryApp.factory('SelectedText', ['HelperService','$http','AppUrlSvc' , function(HelperService,$http,AppUrlSvc) {
	var selectedTextContent;
    var selectedText;

	var o = {};

	o.getSelectedTextLabel = function () {
		return selectedTextContent;
	};
	o.setSelectedTextLabel = function (content) {
		selectedTextContent = content;
	};
    o.getSelectedTextObject = function () {
        return selectedText;
    };
    o.setSelectedTextObject = function (txt) {
        selectedText = txt;
    };
    o.getTextId = function () {
        return selectedText !== undefined ? selectedText.TextId : '';
    };

    o.readTextFromId = function (id, areaName, doIfSuccess) {
        // Read intention from cache or server then call doIfIntentionReadSuccessfullyFromServerOrCache;
        var url = AppUrlSvc.urlTextFromId(id, areaName);

        $http({
            method: 'GET',
            cache:false,
            url: url
            //,headers: {"Content-Type":"application/json","Accept":"application/vnd.cyrano.textspage-v1.1+json"}
        })
            .success(function (data, status) {
                console.log(status + "*" + " " + url);
                o.setSelectedTextLabel(data.Content);
                o.setSelectedTextObject(data);
                if (doIfSuccess)
                    doIfSuccess(data);
            })
            .error(function (data, status) {
                console.log("-- bad request -- " + url + " " + status);
            });
    };

	return o;
}]);