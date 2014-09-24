describe("intentionsSvc", function() {

  // Mock out the $route to save us from having to load up the whole ngRoute
//  beforeEach(module(function($provide) {
//    $provide.value('$route', {
//      current: {
//        params: {}
//      }
//    });
//  }));

  beforeEach(module('app/intentions'));
//  beforeEach(module('app/routing'));


  describe("getForArea", function() {

    it("should request the intentions from the cacheSvc", inject(function(cacheSvc, $q, $rootScope, intentionsSvc) {
      var dummyIntentions = [],
          intentions;

      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get').andReturn($q.when(dummyIntentions));

      // Get the intentions. When the promise fulfills, store it for checking later
      intentionsSvc.getForArea('dummyAreaName').then(function(_intentions_) {
        intentions = _intentions_;
      });
      // Trigger the promise to resolve
      $rootScope.$digest();

      // Check that the cache was hit and that we got the right data back
      expect(cacheSvc.get).toHaveBeenCalled();
      expect(intentions).toBe(dummyIntentions);
    }));


    it('should pass a function to the cacheSvc that calls serverRequest', inject(function(cacheSvc, $httpBackend, intentionsSvc) {
      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get');

      // Get the intentions.
      intentionsSvc.getForArea('dummyArea');

      // Check that the getFn will call make a server request
      $httpBackend.expectGET('http://api.cvd.io/dummyArea/intentions').respond([]);

      var getFn = cacheSvc.get.mostRecentCall.args[2];
      getFn();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });


  describe("getIntention", function() {

    it("should request an intention from the cacheSvc", inject(function(cacheSvc, $q, $rootScope, intentionsSvc) {
      var dummyIntention = {},
          intention;

      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get').andReturn($q.when(dummyIntention));

      // Get the intentions. When the promise fulfills, store it for checking later
      intentionsSvc.getIntention('dummyArea', 'dummyIntention').then(function(_intention_) {
        intention = _intention_;
      });
      // Trigger the promise to resolve
      $rootScope.$digest();

      // Check that the cache was hit and that we got the right data back
      expect(cacheSvc.get).toHaveBeenCalled();
      expect(intention).toBe(dummyIntention);
    }));


    it('should pass a function to the cacheSvc that calls serverRequest', inject(function(cacheSvc, $httpBackend, intentionsSvc) {
      // Set up a spy on the cacheSvc
      spyOn(cacheSvc, 'get');

      // Get the intentions.
      intentionsSvc.getIntention('dummyAreaName', 'dummyIntentionId');

      // Check that the getFn will call make a server request
      $httpBackend.expectGET('http://api.cvd.io/dummyAreaName/dummyIntentionId').respond({});

      var getFn = cacheSvc.get.mostRecentCall.args[2];
      getFn();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });
});