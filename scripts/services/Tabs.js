cherryApp.factory('Tabs', ['$rootScope', function($rootScope) {

  var svc = {
    showTabs: true,
    currentTabName: ''
  };

  $rootScope.$on('$routeChangeSuccess', function(evt, current, previous) {

    if ( angular.isDefined(current.showTabs) ) {
      svc.showTabs = current.showTabs;
    }

    if ( angular.isDefined(current.tabName) ) {
      svc.currentTabName = current.tabName;
    }
  });
  return svc;

}]);