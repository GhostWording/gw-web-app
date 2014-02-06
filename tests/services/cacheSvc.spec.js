describe("cacheSvc", function() {
  var cacheSvc;
  var getMyData;

  beforeEach(module('cherryApp'));

  beforeEach(inject(function(_cacheSvc_) {
    cacheSvc = _cacheSvc_;
      getMyData = jasmine.createSpy('getMyData').andReturn({ some: 'data'});
      cacheSvc.register('myData', 10, getMyData);
  }));

  describe("register", function() {
    it("should register a name and function into the cache", function() {
      expect(cacheSvc._cache['myData']).toEqual(jasmine.objectContaining({
        name: 'myData',
        getFn: getMyData
      }));
    });
  });

  describe("get", function() {
    it("should call the getFn if the data has not yet been retrieved", function() {
      var promise = cacheSvc.get('myData');
      expect(getMyData).toHaveBeenCalled();
    });

    it("should get the data locally if available", inject(function(localStorage, $rootScope) {
      // Mock out the localStorage
      spyOn(localStorage, 'get').andReturn('some data');

      // This time we should hit the localStorage
      var promise = cacheSvc.get('myData');
      expect(getMyData).not.toHaveBeenCalled();
      expect(localStorage.get).toHaveBeenCalled();
      promise.then(function(data) {
        expect(data).toEqual('some data');
      });

      // This digest triggers the resolution of the promise
      $rootScope.$digest();

      // Rest the spy
      localStorage.get.reset();

      // This time we should just get the promise from memory
      promise = cacheSvc.get('myData');
      expect(getMyData).not.toHaveBeenCalled();
      expect(localStorage.get).not.toHaveBeenCalled();
      promise.then(function(data) {
        expect(data).toEqual('some data');
      });
      $rootScope.$digest();
    }));

  });

  describe("update", function() {
    it("should clear the cache if the changeId greater than the stored one", function() {
      cacheSvc.get('myData');
      expect(getMyData).toHaveBeenCalled();
      
      getMyData.reset();
      cacheSvc.get('myData');
      expect(getMyData).not.toHaveBeenCalled();

      getMyData.reset();
      cacheSvc.update('myData', 123);
      cacheSvc.get('myData');
      expect(getMyData).toHaveBeenCalled();

      getMyData.reset();
      cacheSvc.get('myData');
      expect(getMyData).not.toHaveBeenCalled();

      getMyData.reset();
      cacheSvc.update('myData', 123);
      cacheSvc.get('myData');
      expect(getMyData).not.toHaveBeenCalled();

      getMyData.reset();
      cacheSvc.update('myData', 124);
      cacheSvc.get('myData');
      expect(getMyData).toHaveBeenCalled();

    });
  });
});