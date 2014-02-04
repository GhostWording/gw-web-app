// Display label of current intention
cherryApp.controller('IntentionLabelController', ['$scope','SelectedIntention','SingleIntentionQuerySvc', function ($scope, SelectedIntention,SingleIntentionQuerySvc) {

    var intention = SelectedIntention.getSelectedIntention();
    if (intention !== undefined)
        $scope.intentionLabel = intention.Label;
    else
        ReadAndDisplayIntention(SelectedIntention.getSelectedIntentionId());

    function ReadAndDisplayIntention(id) {
        if ( id === undefined)
            console.log("undefined intention label id");
        else
            SingleIntentionQuerySvc.query(id,$scope.areaId,doIfIntentionRead);
    }

    function doIfIntentionRead(data) {
        $scope.intentionLabel = data.Label;
        SelectedIntention.setSelectedIntention(data);
    }


}]);