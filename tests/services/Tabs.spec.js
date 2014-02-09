describe("Tabs service", function() {
  beforeEach(module('cherryApp'));
  it("should listen to $routeChangeSuccessEvents", inject(function(Tabs,SelectedArea, $rootScope,$location) {
    expect(Tabs.showTabs).toEqual(true);
    expect(Tabs.currentTabName).toEqual('');

    var newRoute = {
      showTabs: false
    };

    $rootScope.$broadcast('$routeChangeSuccess', newRoute, null);

    expect(Tabs.showTabs).toEqual(false);


    // Should work ? Does not !
    SelectedArea.setSelectedAreaName('Family');
    //$location.path('/area/Family/intention')

    expect(Tabs.currentTabName).toEqual('Family');
  }));
});