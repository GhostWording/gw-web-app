describe("activeRecipientsSvc", function() {

  // TODO: create a generic mock cacheSvc that simplifies these and other tests that use cacheSvc
  // TODO: this service does not seem to depend on cacheSvc.Is this necessary anymore? (LP)
  beforeEach(module('app/recipients'));

  describe("makeCacheKey", function() {

    it("should return the recipientAlertState id", inject(function($rootScope, activeRecipientsSvc) {
      expect(activeRecipientsSvc.makeCacheKey('testId')).toEqual('recipientAlertState.testId');
    }));

  });

  describe("getStateForRecipientTypeAlerts", function() {

    it("should return the alert state for a recipient from the localstorage", inject(function(activeRecipientsSvc, localStorage) {
      // Create spies for localStorage.get and makeCacheKey and mock what the functions return
      var getSpy = spyOn(localStorage, 'get').andReturn('testState'),
          makeCacheKeySpy = spyOn(activeRecipientsSvc, 'makeCacheKey').andReturn('cacheTestId');

      activeRecipientsSvc.getStateForRecipientTypeAlerts('testId');
      // Expect localStorage.get and makeCacheKey to have been called with correct params
      expect(getSpy).toHaveBeenCalledWith('cacheTestId');
      expect(makeCacheKeySpy).toHaveBeenCalledWith('testId');
      // Expect that the function returns the correct value
      expect(activeRecipientsSvc.getStateForRecipientTypeAlerts('testId')).toEqual('testState');
    }));

  });

  describe("getActiveRecipients", function () {

    it("should return a promise to a list of active recipients", inject(function(subscribableRecipientsSvc, activeRecipientsSvc, $rootScope, $q) {
      // Mock recipients array
      var dummyRecipients = [
            { "Id": "dummyF" },
            { "Id": "dummyM" },
            { "Id": "dummyFriends" }
          ],
          dummyStates = {
            "dummyF": false,
            "dummyM": true,
            "dummyFriends": true
          },
          // Create required spies
          getAllSpy = spyOn(subscribableRecipientsSvc, 'getAll').andReturn($q.when(dummyRecipients)),
          alertStateSpy = spyOn(activeRecipientsSvc, 'getStateForRecipientTypeAlerts').andCallFake(function(id) {
            return dummyStates[id];
          });
      // Since we mocked the getStateForRecipientAlerts to return true only for 2 of the recipients
      // we resolve the promise and check that activeRecipients array equals to what we expect
      var activeRecipients;
      activeRecipientsSvc.getActiveRecipients().then(function(_activeRecipients_) {
        activeRecipients = _activeRecipients_;
      });
      // Force promise to resolve
      $rootScope.$digest();

      expect(activeRecipients).toEqual(jasmine.any(Array));
      expect(activeRecipients.length).toEqual(2);
      expect(activeRecipients[0].Id).toEqual('dummyM');
      expect(activeRecipients[1].Id).toEqual('dummyFriends');
      // The spy is called for all the items in the dummyRecipients array.
      expect(alertStateSpy.callCount).toEqual(3);
    }));

  });

  describe("switchStateForRecipientTypeAlerts", function() {

    it("should set the alert type state for a specific recipient", inject(function(activeRecipientsSvc, localStorage) {
      // Create required spies
      var localStorageSetSpy = spyOn(localStorage, 'set'),
          makeCacheKeySpy = spyOn(activeRecipientsSvc, 'makeCacheKey').andReturn('testId');
          // We force getStateForRecipientTypeAlerts to return false
          getStateSpy = spyOn(activeRecipientsSvc, 'getStateForRecipientTypeAlerts').andReturn(false);

      activeRecipientsSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', true);
      // We force getStateForRecipientTypeAlerts to return true
      getStateSpy.andReturn(true);
      activeRecipientsSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', false);

    }));
  });

});