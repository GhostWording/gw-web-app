cherryApp.factory('Tabs', ['$rootScope', function($rootScope) {

  var svc = {
    showTabs: true,
    currentTabName: ''
  };

  $rootScope.$on('$routeChangeSuccess', function(evt, current, previous) {
    svc.showTabs = current.showTabs;
    svc.currentTabName = current.tabName;
  });
 
  return svc;

}]);