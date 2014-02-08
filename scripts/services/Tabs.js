//cherryApp.factory('Tabs', ['$rootScope', function($rootScope) {
cherryApp.factory('Tabs', ['$rootScope','SelectedArea', function($rootScope,SelectedArea) {

    var svc = {
        showTabs: true,
        currentTabName: '',
        setTab: function (areaName) {
            svc.currentTabName = areaName;
        }
    };

//    Use watch instead now that the name can be watched
//    $rootScope.$on('areaChange', function(evt, current) {
//      svc.currentTabName = current;
//    });

    $rootScope.$watch(SelectedArea.getSelectedAreaName,function(areaName) {
        if ( areaName )
            svc.currentTabName = areaName;
    });


  return svc;

}]);