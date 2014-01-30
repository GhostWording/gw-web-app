describe("actionLocation directive", function() {
  beforeEach(module('cherryApp'));
  it("should provide a controller function for posting an action", inject(function($compile, $rootScope, PostActionSvc) {
    spyOn(PostActionSvc, 'postActionInfo');

    var element = $compile('<div action-location="someLocation"></div>')($rootScope);
    var controller = element.controller('actionLocation');
    expect(controller.postAction).toEqual(jasmine.any(Function));
    controller.postAction('a', 'b', 'c','d');
    expect(PostActionSvc.postActionInfo).toHaveBeenCalledWith('a', 'b', 'someLocation', 'c','d');
  }));
});


describe("<a> (postAction) directive", function() {
  beforeEach(module('cherryApp'));
  it("should hook into the nearest actionLocation and call its postAction function when clicked", inject(function($compile, $rootScope, PostActionSvc) {
    spyOn(PostActionSvc, 'postActionInfo');

    var element = angular.element(
      '<div action-location="someLocation">' +
        '<a href="area/action">Some Link</a>' +
      '</div>');
    var anchorElement = element.find('a');
    
    $compile(element)($rootScope);

    anchorElement.triggerHandler('click');
    
    expect(PostActionSvc.postActionInfo).toHaveBeenCalledWith('area', 'action','someLocation','click',undefined);
  }));

  it("should override the defaults if attributes are provided", inject(function($compile, $rootScope, PostActionSvc) {
    spyOn(PostActionSvc, 'postActionInfo');

    var element = angular.element(
      '<div action-location="someLocation">' +
        '<a href="area/action/data1/data2" actionType="otherAction" targetType="otherTarget" targetId="otherId" targetParameters="otherParam">Some Link</a>' +
      '</div>');
    var anchorElement = element.find('a');
    
    $compile(element)($rootScope);

    anchorElement.triggerHandler('click');
    
    expect(PostActionSvc.postActionInfo).toHaveBeenCalledWith('otherTarget', 'otherId', 'someLocation', 'otherAction', 'otherParam');
  }));

it("should not be called if href is undefined", inject(function ($compile, $rootScope, PostActionSvc) {
    spyOn(PostActionSvc, 'postActionInfo');

    var element = angular.element(
        '<div action-location="someLocation">' +
            '<a>Some Link</a>' +
            '</div>');
    var anchorElement = element.find('a');

    $compile(element)($rootScope);
    anchorElement.triggerHandler('click');

    // How to say I expect the opposite ?????
    //expect(PostActionSvc.postActionInfo).toHaveBeenCalled();  //
    }));
});

describe("<button> (postAction) directive", function() {
  beforeEach(module('cherryApp'));
  it("should hook into the nearest actionLocation and call its postAction function when clicked", inject(function($compile, $rootScope, PostActionSvc) {
    spyOn(PostActionSvc, 'postActionInfo');

    var element = angular.element(
      '<div action-location="someLocation">' +
//        '<button ng-click="area.action(data1,data2)">Some Button</a>' +
          '<button ng-click="Navigation.action(data1,data2)">Some Button</a>' +
      '</div>');
    var anchorElement = element.find('button');
    
    $compile(element)($rootScope);

    anchorElement.triggerHandler('click');
    
    expect(PostActionSvc.postActionInfo).toHaveBeenCalledWith('Navigation', 'action', 'someLocation', 'click', 'data1,data2');
  }));
});