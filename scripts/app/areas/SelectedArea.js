// Keeps track of the currently selected area
// !! Area names are now used as Ids as well !!
cherryApp.factory('SelectedArea',['$rootScope','$routeParams', function ($rootScope,$routeParams) {
    //var selectedAreaName;
    var o = {};
    o.name = "";

    o.setSelectedAreaName = function (areaName) {
        //selectedAreaName = areaName; // Can't watch this successfully
        o.name = areaName;
        // Change Tabs display
        //$rootScope.$broadcast('areaChange',areaName);
    };
    o.getSelectedAreaName = function () {
//        return selectedAreaName;
        return o.name;
    };
    o.wantsToDisplayTextTitles = function() {
       return o.name == "Formalities";
    };

    o.wantsToDisplayTextFilters = function() {
        return o.name != "Formalities";
    };

    $rootScope.$on('$routeChangeSuccess', function (evt, current, previous) {
        var areaName = $routeParams.areaName;
        if (areaName  ) {
            // Don't bother to read the intention if the currentIntention is already the correct one
            if ( !o.name || o.name != areaName  ) {
                o.name = areaName;
            }
        }
    });

    return o;
}]);