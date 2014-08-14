describe("actionLocation directive", function() {
  beforeEach(module('cherryApp'));

  it("should provide a controller function for posting an action", inject(function($compile, $rootScope, postActionSvc) {
    spyOn(postActionSvc, 'postActionInfo');

    var element = $compile('<div action-location="someLocation"></div>')($rootScope);
    var controller = element.controller('actionLocation');
    expect(controller.postAction).toEqual(jasmine.any(Function));
    controller.postAction('a', 'b', 'c','d');
    expect(postActionSvc.postActionInfo).toHaveBeenCalledWith('a', 'b', 'someLocation', 'c','d');
  }));
});


describe("<a> (postAction) directive", function() {
  beforeEach(module('cherryApp'));

  it("should hook into the nearest actionLocation and call its postAction function when clicked", inject(function($compile, $rootScope, postActionSvc) {
    spyOn(postActionSvc, 'postActionInfo');

    var element = angular.element(
      '<div action-location="someLocation">' +
        '<a href="area/action">Some Link</a>' +
      '</div>');
    var anchorElement = element.find('a');

    $compile(element)($rootScope);

    anchorElement.triggerHandler('click');

    expect(postActionSvc.postActionInfo).toHaveBeenCalledWith('area', 'action','someLocation','click',undefined);
  }));

  it("should override the defaults if attributes are provided", inject(function($compile, $rootScope, postActionSvc) {
    spyOn(postActionSvc, 'postActionInfo');

    var element = angular.element(
      '<div action-location="someLocation">' +
        '<a href="area/action/data1/data2" actionType="otherAction" targetType="otherTarget" targetId="otherId" targetParameters="otherParam">Some Link</a>' +
      '</div>');
    var anchorElement = element.find('a');

    $compile(element)($rootScope);

    anchorElement.triggerHandler('click');

    expect(postActionSvc.postActionInfo).toHaveBeenCalledWith('otherTarget', 'otherId', 'someLocation', 'otherAction', 'otherParam');
  }));

    it("should return if actionType is noTracking", inject(function($compile, $rootScope, postActionSvc) {
        spyOn(postActionSvc, 'postActionInfo');

        var element = angular.element(
            '<div action-location="someLocation">' +
                '<a href="area/action/data1/data2" actionType="noTracking" targetType="otherTarget" targetId="otherId" targetParameters="otherParam">Some Link</a>' +
                '</div>');
        var anchorElement = element.find('a');

        $compile(element)($rootScope);

        anchorElement.triggerHandler('click');

        expect(postActionSvc.postActionInfo).not.toHaveBeenCalled();
    }));

    it("should read ngClick parameter if targetType is Command", inject(function($compile, $rootScope, postActionSvc) {
        spyOn(postActionSvc, 'postActionInfo');

        // What if I want to test ng-click="Module.Function('otherParam')" syntax, with '' around otherParam ?
        var element = angular.element(
            '<div action-location="someLocation">' +
                '<a actionType="otherAction" targetType="Command" targetId="otherId" ng-click="Module.Function(otherParam)" >Some Link</a>' +
                '</div>');
        var anchorElement = element.find('a');
        $compile(element)($rootScope);
        anchorElement.triggerHandler('click');

        expect(postActionSvc.postActionInfo).toHaveBeenCalledWith('Command', 'otherId', 'someLocation', 'otherAction', 'otherParam');
    }));
});

describe("<button> (postAction) directive", function() {
  beforeEach(module('cherryApp'));
  it("should hook into the nearest actionLocation and call its postAction function when clicked", inject(function($compile, $rootScope, postActionSvc) {
    spyOn(postActionSvc, 'postActionInfo');

    var element = angular.element(
      '<div action-location="someLocation">' +
//        '<button ng-click="area.action(data1,data2)">Some Button</a>' +
          '<button ng-click="Navigation.action(data1,data2)">Some Button</a>' +
      '</div>');
    var anchorElement = element.find('button');

    $compile(element)($rootScope);

    anchorElement.triggerHandler('click');

    expect(postActionSvc.postActionInfo).toHaveBeenCalledWith('Navigation', undefined, 'someLocation', 'click', undefined);
  }));
});