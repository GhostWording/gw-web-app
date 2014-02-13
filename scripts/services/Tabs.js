//cherryApp.factory('Tabs', ['$rootScope', function($rootScope) {
cherryApp.factory('Tabs', ['$rootScope','SelectedArea', function($rootScope,SelectedArea) {

    var svc = {
        showTabs: true,
        currentTabName: '',
        setTab: function (areaName) {
            svc.currentTabName = areaName;
        }
    };

    $rootScope.$on('$routeChangeSuccess', function (evt, current, previous) {
        svc.showTabs = current.showTabs;
    });

    $rootScope.$watch(SelectedArea.getSelectedAreaName,function(areaName) {
        if ( areaName )
            svc.currentTabName = areaName;
    });

  return svc;

}]);