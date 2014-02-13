cherryApp.factory('intentions', [ '$rootScope', '$routeParams', 'areas', 'intentionApi', function($rootScope, $routeParams, areas, intentionApi) {

    var intentionsPromise;
    var intentions = {
        current: null,
        list: []
    };

    function updateList(area) {
        intentions.list = [];
        if ( area ) {
            return intentionApi.forArea(area.name).then(function(intentionList) {
               intentions.list = intentionList;
            });
        }
    }

    function updateCurrent(intentionId) {
        if ( !intentionId ) {
            intentions.current = null;
        } else {
            // The current intention has changed but we might have to wait for the list of intentions to arrive
            if ( intentionsPromise ) {
                intentionsPromise.then(function() {
                    for (var i = intentions.list.length - 1; i >= 0; i--) {
                        var intention = intentions.list[i];
                        if ( intention.IntentionId === intentionId ) {
                            intentions.current = intention;
                            console.log('Current Intention has changed to "' + intentionId + '"');
                            return;
                        }
                    }
                });
            }
        }
    }

    $rootScope.$watch(function() { return areas.currentArea; }, function(currentArea) {
        intentionsPromise = updateList(currentArea);
    });

    $rootScope.$watch(function() { return $routeParams.intentionId; }, function(intentionId) {
        updateCurrent(intentionId);
    });

    return intentions;
    
}]);