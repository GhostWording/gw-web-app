// Display label of current intention
cherryApp.controller('IntentionLabelController', ['$scope','SelectedIntention','intentionApi', function ($scope, SelectedIntention,intentionApi) {

    var intention = SelectedIntention.getSelectedIntention();
    if (intention !== undefined)
        $scope.intentionLabel = intention.Label;
    else
        ReadAndDisplayIntention(SelectedIntention.getSelectedIntentionId());

    function doIfIntentionRead(data) {
        $scope.intentionLabel = data.Label;
        SelectedIntention.setSelectedIntention(data);
    }

    function ReadAndDisplayIntention(id) {
        if ( id === undefined)
            console.log("undefined intention label id");
        else {
            intentionApi.one($scope.areaId,id)
                .then(   function (data) {
                    $scope.intentionLabel = data.Label;
                    SelectedIntention.setSelectedIntention(data);
                }  );
        }
    }



}]);