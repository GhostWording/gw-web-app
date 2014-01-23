// Keeps track of the currently selected intention
cherryApp.factory('SelectedIntention', [function () {
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
    return o;
}]);