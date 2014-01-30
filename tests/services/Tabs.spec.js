describe("Tabs service", function() {
  beforeEach(module('cherryApp'));
  it("should listen to $routeChangeSuccessEvents", inject(function(Tabs,SelectedArea, $rootScope) {
    expect(Tabs.showTabs).toEqual(true);
    expect(Tabs.currentTabName).toEqual('');

    var newRoute = {
      showTabs: false
    };

    $rootScope.$broadcast('$routeChangeSuccess', newRoute, null);

    expect(Tabs.showTabs).toEqual(false);

    SelectedArea.setSelectedAreaName('DaytoDay');
    expect(Tabs.currentTabName).toEqual('DaytoDay');
  }));
});