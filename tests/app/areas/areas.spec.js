describe("areasSvc", function() {

  // Mock out the $routeParams to save us from having to load up the whole ngRoute
  beforeEach(module(function($provide) {
    $provide.value('$routeParams', {});
  }));

  // TODO: create a generic mock cacheSvc that simplifies these and other tests that use cacheSvc


  beforeEach(module('app/areas'));

  describe("getCurrent", function() {
    
    it("should lookup the current area in the $routeParams", inject(function(areasSvc, $routeParams) {
      spyOn(areasSvc, 'getArea');
      $routeParams.areaName = 'dummy';
      areasSvc.getCurrent();
      expect(areasSvc.getArea).toHaveBeenCalledWith('dummy');
    }));
  });


  describe("getAll", function() {

    it("should request the areas from the cacheSvc", inject(function(cacheSvc, $q, $rootScope, areasSvc) {
      var dummyAreas = [],
          areas;

      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get').andReturn($q.when(dummyAreas));

      // Get the areas. When the promise fulfills, store it for checking later
      areasSvc.getAll().then(function(_areas_) {
        areas = _areas_;
      });
      // Trigger the promise to resolve
      $rootScope.$digest();

      // Check that the cache was hit and that we got the right data back
      expect(cacheSvc.get).toHaveBeenCalled();
      expect(areas).toBe(dummyAreas);
    }));


    it('should pass a function to the cacheSvc that calls serverRequest', inject(function(cacheSvc, $httpBackend, areasSvc) {
      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get');

      // Get the areas.
      areasSvc.getAll();

      // Check that the getFn will call make a server request
      $httpBackend.expectGET('http://api.cvd.io/areas').respond([]);

      var getFn = cacheSvc.get.mostRecentCall.args[2];
      getFn();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });

  
  describe("getArea", function() {

    it("should request an area from the cacheSvc", inject(function(cacheSvc, $q, $rootScope, areasSvc) {
      var dummyArea = {},
          area;

      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get').andReturn($q.when(dummyArea));

      // Get the areas. When the promise fulfills, store it for checking later
      areasSvc.getArea('dummy').then(function(_area_) {
        area = _area_;
      });
      // Trigger the promise to resolve
      $rootScope.$digest();

      // Check that the cache was hit and that we got the right data back
      expect(cacheSvc.get).toHaveBeenCalled();
      expect(area).toBe(dummyArea);
    }));


    it('should pass a function to the cacheSvc that calls serverRequest', inject(function(cacheSvc, $httpBackend, areasSvc) {
      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get');

      // Get the areas.
      areasSvc.getArea('dummy');

      // Check that the getFn will call make a server request
      $httpBackend.expectGET('http://api.cvd.io/dummy').respond({});

      var getFn = cacheSvc.get.mostRecentCall.args[2];
      getFn();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });
});