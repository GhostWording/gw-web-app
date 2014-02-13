// Display label of current intention
cherryApp.controller('IntentionLabelController', ['$scope','SelectedIntention', function ($scope, SelectedIntention) {

    // TODO : call from routing
//    if ( !SelectedIntention.getSelectedIntention() )
//        SelectedIntention.readIntentionFromId($routeParams.areaName,$routeParams.intentionId);


    $scope.$watch(SelectedIntention.getSelectedIntention,
        function(intention) {
            if ( intention && intention.Label ) {
                $scope.intentionLabel = intention.Label;
            }
        }
    );

}]);