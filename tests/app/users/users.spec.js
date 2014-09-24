describe("currentUser", function() {
  beforeEach(module('app/users'));
  beforeEach(module('common/users/currentUser'));

  beforeEach(module(function($provide) {
    $provide.value('$cookieStore', {
      get: jasmine.createSpy('$cookieStore.get'),
      put: jasmine.createSpy('$cookieStore.put')
    });
  }));

  it("should get the currentUser from the cookie", inject(function($cookieStore, currentUser) {
    expect($cookieStore.get).toHaveBeenCalled();
  }));

  it("should update the cookie whenever the current user's properties change", inject(function($rootScope, $cookieStore, currentUser) {
    $rootScope.$digest();
    expect($cookieStore.put).not.toHaveBeenCalled();
    currentUser.gender = 'M';
    $rootScope.$digest();
    expect($cookieStore.put).toHaveBeenCalled();
  }));
});

describe("UserProfileController", function() {
  beforeEach(module(function($provide) {
    $provide.value('$cookieStore', {
      get: jasmine.createSpy('$cookieStore.get'),
      put: jasmine.createSpy('$cookieStore.put')
    });
  }));
  beforeEach(module('app/users'));
  beforeEach(module('common/users/currentUser'));


  it("should attach the currentUser to the scope", inject(function($rootScope, $controller, currentUser) {
    $controller('UserProfileController', { $scope: $rootScope });
    expect($rootScope.currentUser).toBe(currentUser);
  }));
});
