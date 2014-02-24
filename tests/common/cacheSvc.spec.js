describe("cacheSvc", function() {
  var cacheSvc;
  var getMyData;
  var localStorage;
  var $rootScope;

  beforeEach(module('common/cache'));

  beforeEach(inject(function(_cacheSvc_, _localStorage_, _$rootScope_) {
   
    // Store a reference to $rootScope
    $rootScope = _$rootScope_;

    // Mock out the localStorage
    localStorage = _localStorage_;
    spyOn(localStorage, 'get').andReturn(undefined);

    // Create a mock data getter function
    getMyData = jasmine.createSpy('getMyData').andReturn({ some: 'data'});

    // Initalize the cache
    cacheSvc = _cacheSvc_;
    cacheSvc.register('myData', undefined, getMyData);
  }));

  describe("register", function() {
    it("should register a name, lastChange value and getFn function into the cache", function() {
      cacheSvc.register('myData', 10, getMyData);
      expect(cacheSvc._cache['myData']).toEqual(jasmine.objectContaining({
        name: 'myData',
        getFn: getMyData,
        lastChange: 10
      }));
    });
  });


  describe("get", function() {
    it("should call the getFn if the data has not yet been retrieved", function() {
      var promise = cacheSvc.get('myData');
      expect(getMyData).toHaveBeenCalled();
    });

    it("should get the data locally if available", function() {
      // Mock out the localStorage to return
      localStorage.get.andReturn('some data');

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
    });

    it("should not store the data in localStorage if skipLocalStorage is true", function() {
      // Mock out the localStorage
      localStorage.get.andReturn('some data');

      // This time we should hit the localStorage
      var promise = cacheSvc.get('myData', 999, getMyData, true);
      expect(getMyData).toHaveBeenCalled();
      expect(localStorage.get).not.toHaveBeenCalled();
      
    });

  });

  describe("update", function() {
    it("should update the lastChange value without clearing the cache the first time it is called", function() {
      cacheSvc.get('myData');
      expect(getMyData).toHaveBeenCalled();
      expect(cacheSvc._cache['myData'].lastChange).toBeUndefined();
      getMyData.reset();

      cacheSvc.update('myData', 1234);
      expect(cacheSvc._cache['myData'].lastChange).toEqual(1234);
      cacheSvc.get('myData');
      expect(getMyData).not.toHaveBeenCalled();
      expect(cacheSvc._cache['myData'].lastChange).toEqual(1234);

      cacheSvc.update('myData', 1235);
      expect(cacheSvc._cache['myData'].lastChange).toEqual(1235);
      cacheSvc.get('myData');
      expect(getMyData).toHaveBeenCalled();
    });

    it("should clear the cache if the changeId greater than the stored one", function() {
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

      getMyData.reset();
      cacheSvc.update('myData', 124);
      cacheSvc.get('myData');
      expect(getMyData).not.toHaveBeenCalled();

    });
  });
});