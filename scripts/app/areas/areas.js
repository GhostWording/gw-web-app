cherryApp.factory('areas', [
    '$rootScope', '$routeParams', 'cacheSvc', 'areaApi',
    function($rootScope, $routeParams, cacheSvc, areaApi) {

    var areasPromise = getAreas();

    var areas = {
        currentName: null,
        current: null,
        all: [],
        updateAreas: updateAreas
    };

    function getAreas() {
        return cacheSvc.get('areas', -1, areaApi.allAreas).then(function(areaList) {
            areas.all = areaList;
            updateCurrentArea();
        });
    }

    function updateAreas(lastChange) {
        cacheSvc.update('areas', lastChange);
        // Automatically retrieve the area list if things have changed
        areasPromise = getAreas();
    }

    function updateCurrentArea() {
        areas.current = null;
        if ( areas.currentName ) {

            // We have an area name but we have to wait for the areas list to arrive
            areasPromise.then(function() {
                for (var i = areas.all.length - 1; i >= 0; i--) {
                    var area = areas.all[i];
                    if ( area.Name === areas.currentName ) {
                        areas.current = area;
                        break;
                    }
                }
            });
        }
    }


    // TODO : remove one of these two watches when routeParams is consistent
    // Watch the routeParams to see if the current area has changed
    $rootScope.$watch(function() { return $routeParams.areaName + $routeParams.areaId; }, function() {
        areas.currentName = $routeParams.areaName || $routeParams.areaId;
        updateCurrentArea();
    }, true);

    return areas;
    
}]);