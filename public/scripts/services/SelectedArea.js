// Keeps track of the currently selected area
cherryApp.factory('SelectedArea', function () {
    var selectedArea;
    var selectedAreaName;
    var o = {};

//    // GET AND SET
//    o.setSelectedArea = function (area) {
//        selectedArea = area;
//    };
//    o.getSelectedArea = function () {
//        return selectedArea;
//    };
//    o.getSelectedAreaName = function () {
//        return selectedArea == undefined  ? "" : selectedArea.Name;
//    };

    o.setSelectedAreaName = function (areaName) {
        selectedAreaName = areaName;
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

});