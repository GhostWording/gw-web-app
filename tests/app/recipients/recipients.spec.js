describe("recipientsSvc", function() {

  // Mock out the $routeParams to save us from having to load up the whole ngRoute
  beforeEach(module(function($provide) {
    $provide.value('$routeParams', {});
  }));

  // TODO: create a generic mock cacheSvc that simplifies these and other tests that use cacheSvc

  beforeEach(module('app/recipients'));

  describe("getAll", function() {

    it("should return a promise to a list of recipients", inject(function($rootScope, recipientsSvc) {
      var recipients;
      recipientsSvc.getAll().then(function(_recipients_) {
        recipients = _recipients_;
      });
      // Trigger the promise to resolve
      $rootScope.$digest();
      expect(recipients).toEqual(jasmine.any(Array));
    }));
  });
});


describe("RecipientListController", function() {
  beforeEach(module('app/recipients'));

  it("should attach the provided recipients to the scope", inject(function($rootScope, $controller) {
    var dummyRecipients = [];
    $controller('RecipientListController', { $scope: $rootScope, recipients: dummyRecipients });
    expect($rootScope.lesQui).toBe(dummyRecipients);
  }));
});