describe("subscribedRecipientTypesSvc", function() {

  // TODO: create a generic mock cacheSvc that simplifies these and other tests that use cacheSvc
  // TODO: this service does not seem to depend on cacheSvc.Is this necessary anymore? (LP)
  beforeEach(module('common/recipients'));

  describe("makeCacheKey", function() {

    it("should return the subscriptionState id", inject(function($rootScope, subscribedRecipientTypesSvc) {
      expect(subscribedRecipientTypesSvc.makeCacheKey('testId')).toEqual('subscriptionState.testId');
    }));

  });

  describe("getStateForRecipientTypeAlerts", function() {

    it("should return the alert state for a recipient from the localstorage", inject(function(subscribedRecipientTypesSvc, localStorage) {
      // Create spies for localStorage.get and makeCacheKey and mock what the functions return
      var getSpy = spyOn(localStorage, 'get').andReturn('testState'),
          makeCacheKeySpy = spyOn(subscribedRecipientTypesSvc, 'makeCacheKey').andReturn('cacheTestId');

      subscribedRecipientTypesSvc.getStateForRecipientTypeAlerts('testId');
      // Expect localStorage.get and makeCacheKey to have been called with correct params
      expect(getSpy).toHaveBeenCalledWith('cacheTestId');
      expect(makeCacheKeySpy).toHaveBeenCalledWith('testId');
      // Expect that the function returns the correct value
      expect(subscribedRecipientTypesSvc.getStateForRecipientTypeAlerts('testId')).toEqual('testState');
    }));

  });

  describe("getsubscribedRecipients", function () {

    it("should return a promise to a list of active recipients", inject(function(recipientTypesSvc, subscribedRecipientTypesSvc, $rootScope, $q) {
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
          getAllSpy = spyOn(recipientTypesSvc, 'getAll').andReturn($q.when(dummyRecipients)),
          alertStateSpy = spyOn(subscribedRecipientTypesSvc, 'getStateForRecipientTypeAlerts').andCallFake(function(id) {
            return dummyStates[id];
          });
      // Since we mocked the getStateForRecipientAlerts to return true only for 2 of the recipients
      // we resolve the promise and check that subscribedRecipients array equals to what we expect
      var subscribedRecipients;
      subscribedRecipientTypesSvc.getsubscribedRecipients().then(function(_subscribedRecipients_) {
        subscribedRecipients = _subscribedRecipients_;
      });
      // Force promise to resolve
      $rootScope.$digest();

      expect(subscribedRecipients).toEqual(jasmine.any(Array));
      expect(subscribedRecipients.length).toEqual(2);
      expect(subscribedRecipients[0].Id).toEqual('dummyM');
      expect(subscribedRecipients[1].Id).toEqual('dummyFriends');
      // The spy is called for all the items in the dummyRecipients array.
      expect(alertStateSpy.callCount).toEqual(3);
    }));

  });

  describe("switchStateForRecipientTypeAlerts", function() {

    it("should set the alert type state for a specific recipient", inject(function(subscribedRecipientTypesSvc, localStorage) {
      // Create required spies
      var localStorageSetSpy = spyOn(localStorage, 'set'),
          makeCacheKeySpy = spyOn(subscribedRecipientTypesSvc, 'makeCacheKey').andReturn('testId');
          // We force getStateForRecipientTypeAlerts to return false
          getStateSpy = spyOn(subscribedRecipientTypesSvc, 'getStateForRecipientTypeAlerts').andReturn(false);

      subscribedRecipientTypesSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', true);
      // We force getStateForRecipientTypeAlerts to return true
      getStateSpy.andReturn(true);
      subscribedRecipientTypesSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', false);

    }));
  });

});