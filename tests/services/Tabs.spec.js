describe("Tabs service", function() {
  beforeEach(module('cherryApp'));
  it("should listen to $routeChangeSuccessEvents", inject(function(Tabs, $rootScope) {
    expect(Tabs.showTabs).toEqual(true);
    expect(Tabs.currentTabName).toEqual('');

    var newRoute = {
      showTabs: false,
      tabName: 'newRouteName'
    };

    $rootScope.$broadcast('$routeChangeSuccess', newRoute, null);

    expect(Tabs.showTabs).toEqual(false);
    expect(Tabs.currentTabName).toEqual('newRouteName');
  }));
});