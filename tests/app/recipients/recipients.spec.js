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

  describe("makeCacheKey", function() {

    it("should return the recipientAlertState id", inject(function($rootScope, recipientsSvc) {
      expect(recipientsSvc.makeCacheKey('testId')).toEqual('recipientAlertState.testId');
    }));

  });

  describe("getStateForRecipientTypeAlerts", function() {

    it("should return the alert state for a recipient from the localstorage", inject(function(recipientsSvc, localStorage) {
      var getSpy = spyOn(localStorage, 'get').andReturn('testState'),
          makeCacheKeySpy = spyOn(recipientsSvc, 'makeCacheKey').andReturn('cacheTestId');

      recipientsSvc.getStateForRecipientTypeAlerts('testId');
      expect(getSpy).toHaveBeenCalledWith('cacheTestId');
      expect(makeCacheKeySpy).toHaveBeenCalledWith('testId');
      expect(recipientsSvc.getStateForRecipientTypeAlerts('testId')).toEqual('testState');
    }));

  });

  describe("getActiveRecipients", function () {

    it("should return a promise to a list of active recipients", inject(function(recipientsSvc, $rootScope, $q) {
      var dummyRecipients = [
            { "Id": "dummyF" },
            { "Id": "dummyM" },
            { "Id": "dummyFriends" }
          ],
          getAllSpy = spyOn(recipientsSvc, 'getAll').andReturn($q.when(dummyRecipients)),
          alertStateSpy = spyOn(recipientsSvc, 'getStateForRecipientTypeAlerts').andReturn('testState');

      recipientsSvc.getActiveRecipients().then(function(activeRecipients) {
        expect(activeRecipients).toEqual(jasmine.any(Array));
        expect(activeRecipients.length).toEqual(3);
        expect(activeRecipients[1].Id).toEqual('dummyM');
      });

      $rootScope.$digest();
      expect(alertStateSpy.callCount).toEqual(3);
    }));

  });

  describe("switchStateForRecipientTypeAlerts", function() {

    it("should set the alert type state for a specific recipient", inject(function(recipientsSvc, localStorage) {
      var localStorageSetSpy = spyOn(localStorage, 'set'),
          makeCacheKeySpy = spyOn(recipientsSvc, 'makeCacheKey').andReturn('testId');
          getStateSpy = spyOn(recipientsSvc, 'getStateForRecipientTypeAlerts').andReturn(false);

      recipientsSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', true);
      getStateSpy.andReturn(true);
      recipientsSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', false);

    }));
  });

});


describe("RecipientListController", function() {
  var $rootScope;

  beforeEach(module('app/recipients'));

  beforeEach(inject(function (_$rootScope_, $controller, $q) {
    $rootScope = _$rootScope_;
    var dummyRecipients = ['a', 'b'];
    var mockRecipientsSvc = {
      getAll: function (){
        return $q.when(dummyRecipients);
      }
    };
    $controller('RecipientListController', {$scope: $rootScope, recipientsSvc: mockRecipientsSvc});
  }));

  it("should attach the provided recipients to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.lesQui.length).toBe(2);
    expect($rootScope.lesQui[0]).toEqual('a');
    expect($rootScope.lesQui[1]).toEqual('b');
  });

});
