describe("serverSvc", function() {
  beforeEach(module('common/server'));


  describe("get", function() {

    it("should make a request to the server", inject(function($httpBackend, apiUrl, serverSvc) {
      var dummyResponse = {},
          actualResponse;
      $httpBackend.expectGET(apiUrl + 'dummyRequest').respond(dummyResponse);

      serverSvc.get('dummyRequest').then(function(response) {
        actualResponse = response;
      });

      $httpBackend.flush();
      expect(actualResponse).toEqual(dummyResponse);
      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });
});