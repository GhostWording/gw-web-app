// Keeps track of the currently selected intention
cherryApp.factory('SelectedIntention', ['intentionApi', '$rootScope','$routeParams',  function (intentionApi, $rootScope,$routeParams) {
    var selectedIntention;
    // In some cases, we know the intentionId, but not yet have the full object if it needs to be reloaded from the server
    var selecteIntentionId;

    var o = {};

	// GET AND SET
    o.setSelectedIntention = function (intention) {
        selectedIntention = intention;
        selecteIntentionId = intention.IntentionId;
    };
    o.setSelectedIntentionId = function (id) {
        selecteIntentionId = id;
    };

	o.getSelectedIntention = function () {
		return selectedIntention;
	};

	o.getSelectedIntentionLabel = function () {
		return selectedIntention === undefined  ? "" : selectedIntention.Label;
	};
    o.getSelectedIntentionId = function () {
        return selecteIntentionId;
    };

    $rootScope.$on('$routeChangeSuccess', function (evt, current, previous) {
        var areaName = $routeParams.areaName;
        var intentionId = $routeParams.intentionId;
        if (areaName && intentionId ) {
            // Don't bother to read the intention if the currentIntention is already the correct one
            if ( !selectedIntention || selectedIntention.Id != intentionId  ) {
                o.readIntentionFromId(areaName,intentionId);
            }
        }
    });

    o.readIntentionFromId = function(areaName,intentionId) {
        return intentionApi.one(areaName,intentionId)
            .then(function(data) {
                o.setSelectedIntention(data);});
    };

    return o;
}]);