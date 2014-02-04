// Keeps track of the currently selected area
// !! Area names are now used as Ids as well !!
cherryApp.factory('SelectedArea',['$rootScope', function ($rootScope) {
    var selectedAreaName;
    var o = {};

    o.setSelectedAreaName = function (areaName) {
        selectedAreaName = areaName;
        // Change Tabs display
        $rootScope.$broadcast('areaChange',areaName);
    };
    o.getSelectedAreaName = function () {
        return selectedAreaName;
    };
    o.wantsToDisplayTextTitles = function() {
       return selectedAreaName == "Formalities";
    };

    o.wantsToDisplayTextFilters = function() {
        return selectedAreaName != "Formalities";
    };


    return o;
}]);