//cherryApp.factory('Tabs', ['$rootScope','SelectedArea', function($rootScope,SelectedArea) {
cherryApp.factory('Tabs', ['$rootScope', function($rootScope) {

  var svc = {
    showTabs: true,
    currentTabName: '',
    setTab: function (areaName) {
        svc.currentTabName=areaName; }
    };

  $rootScope.$on('$routeChangeSuccess', function(evt, current, previous) {
    svc.showTabs = current.showTabs;
    //svc.currentTabName = current.tabName;
      //svc.currentTabName = SelectedArea.getSelectedAreaName(); // not set yet :-(
  });


    // Can't find the right syntax !! Will call setTab from SelectedArea service instead
//    $rootScope.areaName = SelectedArea.getSelectedAreaName;
//    $rootScope.$watch('areaName()',svc.setTab(SelectedArea.getSelectedAreaName()));


  return svc;

}]);