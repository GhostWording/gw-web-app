// Keeps track of the currently selected area
// !! Area names are now used as Ids as well !!
cherryApp.factory('SelectedArea',['$rootScope', function ($rootScope) {
    var selectedArea;
    var selectedAreaName;
    var o = {};

    o.setSelectedAreaName = function (areaName) {
        selectedAreaName = areaName;
        // Change Tabs display
        //Tabs.setTab(areaName);
        $rootScope.$broadcast('areaChange',areaName);
    };
    o.getSelectedAreaName = function () {
        return selectedAreaName;
    };

    o.getTabNumberForArea = function(areaName) {
        var retval = 0;
        switch(areaName) {
            case "DayToDay" :
                retval = 0;
                break;
            case "Sentimental" :
                retval = 1;
                break;
            case "Important" :
                retval = 2;
                break;
            default :
                console.log("Unknown area : " + areaName);
                break;
        }
        return retval;
    };

    return o;

}]);