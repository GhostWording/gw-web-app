describe("possibleRecipientsSvc", function() {
	beforeEach(module('app/recipients'));

	describe("getAll", function() {
		it("should return a promise to a list of recipients", inject(function($rootScope, possibleRecipientsSvc) {
			var recipients;
			possibleRecipientsSvc.getAll().then(function(_recipients_) {
				recipients = _recipients_;
			});
			// Trigger the promise to resolve
			$rootScope.$digest();
			expect(recipients).toEqual(jasmine.any(Array));
		}));
	});

	});


	describe("recipientsSvc", function() {

  // TODO: is this required here anymore? (LP)
  // Mock out the $routeParams to save us from having to load up the whole ngRoute
  beforeEach(module(function($provide) {
    $provide.value('$routeParams', {});
  }));

  // TODO: create a generic mock cacheSvc that simplifies these and other tests that use cacheSvc
  // TODO: this service does not seem to depend on cacheSvc.Is this necessary anymore? (LP)
  beforeEach(module('app/recipients'));

  describe("makeCacheKey", function() {

    it("should return the recipientAlertState id", inject(function($rootScope, recipientsSvc) {
      expect(recipientsSvc.makeCacheKey('testId')).toEqual('recipientAlertState.testId');
    }));

  });

  describe("getStateForRecipientTypeAlerts", function() {

    it("should return the alert state for a recipient from the localstorage", inject(function(recipientsSvc, localStorage) {
      // Create spies for localStorage.get and makeCacheKey and mock what the functions return
      var getSpy = spyOn(localStorage, 'get').andReturn('testState'),
          makeCacheKeySpy = spyOn(recipientsSvc, 'makeCacheKey').andReturn('cacheTestId');

      recipientsSvc.getStateForRecipientTypeAlerts('testId');
      // Expect localStorage.get and makeCacheKey to have been called with correct params
      expect(getSpy).toHaveBeenCalledWith('cacheTestId');
      expect(makeCacheKeySpy).toHaveBeenCalledWith('testId');
      // Expect that the function returns the correct value
      expect(recipientsSvc.getStateForRecipientTypeAlerts('testId')).toEqual('testState');
    }));

  });

  describe("getActiveRecipients", function () {

    it("should return a promise to a list of active recipients", inject(function(possibleRecipientsSvc, recipientsSvc, $rootScope, $q) {
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
          getAllSpy = spyOn(possibleRecipientsSvc, 'getAll').andReturn($q.when(dummyRecipients)),
          alertStateSpy = spyOn(recipientsSvc, 'getStateForRecipientTypeAlerts').andCallFake(function(id) {
            return dummyStates[id];
          });
      // Since we mocked the getStateForRecipientAlerts to return true only for 2 of the recipients
      // we resolve the promise and check that activeRecipients array equals to what we expect
      var activeRecipients;
      recipientsSvc.getActiveRecipients().then(function(_activeRecipients_) {
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

    it("should set the alert type state for a specific recipient", inject(function(recipientsSvc, localStorage) {
      // Create required spies
      var localStorageSetSpy = spyOn(localStorage, 'set'),
          makeCacheKeySpy = spyOn(recipientsSvc, 'makeCacheKey').andReturn('testId');
          // We force getStateForRecipientTypeAlerts to return false
          getStateSpy = spyOn(recipientsSvc, 'getStateForRecipientTypeAlerts').andReturn(false);

      recipientsSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', true);
      // We force getStateForRecipientTypeAlerts to return true
      getStateSpy.andReturn(true);
      recipientsSvc.switchStateForRecipientTypeAlerts('testId');
      expect(localStorageSetSpy).toHaveBeenCalledWith('testId', false);

    }));
  });

});

describe("alertSvc", function() {

  beforeEach(module('app/recipients'));

  describe("getAllPossibleSubscriptions", function() {

    it("should return a promise to an array of possible subscriptions", inject(function($rootScope, alertSvc){
      var possibleSubscriptions;
      alertSvc.getAllPossibleSubscriptions().then(function(_possibleSubscriptions_) {
        possibleSubscriptions = _possibleSubscriptions_;
      });
      // Force promise to resolve
      $rootScope.$digest();
      expect(possibleSubscriptions).toEqual(jasmine.any(Array));

    }));

  });

  describe("addPossibleSubscriptionsToRecipients", function() {

    it("should return a promise to an array of alerts for each recipient", inject(function(alertSvc, $rootScope, $q) {
      var dummySubscriptions = [
            {"RecipientTypeId": "9E2D23"},
            {"RecipientTypeId": "9E2D23"},
            {"RecipientTypeId": "9E2D23"},
            {"RecipientTypeId": "64C63D"},
            {"RecipientTypeId": "64C63D"}
          ],
          dummyRecipients = [
            {"RecipientTypeId": "9E2D23"},
            {"RecipientTypeId": "87F524"},
            {"RecipientTypeId": "64C63D"},
            {"RecipientTypeId": "3B9BF2"}
          ],
          getAllSubscriptionsSpy = spyOn(alertSvc, 'getAllPossibleSubscriptions').andReturn($q.when(dummySubscriptions));

      var resultRecipients;
      alertSvc.addPossibleSubscriptionsToRecipients(dummyRecipients).then(function(_recipients_) {
        resultRecipients = _recipients_;
      });
      // Force promise to resolve
      $rootScope.$digest();
      // Test that each recipient has the expected number of alerts attached.
      expect(resultRecipients[0].alerts.length).toEqual(3);
      expect(resultRecipients[1].alerts.length).toEqual(0);
      expect(resultRecipients[2].alerts.length).toEqual(2);
    }));

  });

  describe("getAllRecipientsWithSubscriptions", function() {

    it("should return a promise to subscriptions of active recipients", inject(function(recipientsSvc, alertSvc, $q, $rootScope) {
      var dummyActiveRecipients = [
           {"RecipientTypeId": "9E2D23"},
           {"RecipientTypeId": "87F524"},
           {"RecipientTypeId": "64C63D"}
          ],
          dummyRecipientsSubscriptions = [
            {"RecipientTypeId": "9E2D23", alerts:['a','b','c']},
            {"RecipientTypeId": "87F524", alerts:['a']},
          ],
          activeRecipientsSpy = spyOn(recipientsSvc, "getActiveRecipients").andReturn($q.when(dummyActiveRecipients)),
          subscriptionRecipientsSpy = spyOn(alertSvc, "addPossibleSubscriptionsToRecipients").andReturn(dummyRecipientsSubscriptions);
          var resultRecipients;
          alertSvc.getAllRecipientsWithSubscriptions().then(function(_resultRecipients_) {
            resultRecipients = _resultRecipients_;
          });
          $rootScope.$digest();
          expect(resultRecipients.length).toEqual(2);
          expect(resultRecipients[0].alerts.length).toEqual(3);
          expect(resultRecipients[1].alerts.length).toEqual(1);
    }));

  });

});

describe("RecipientListController", function() {
  var $rootScope,
      mockRecipientsSvc;

  beforeEach(module('app/recipients'));

  beforeEach(inject(function (_$rootScope_, $controller, $q) {
    $rootScope = _$rootScope_;
    var dummyRecipients = ['a', 'b'];

    mockPossibleRecipientsSvc = {
      getAll: function (){
        return $q.when(dummyRecipients);
      },
      switchStateForRecipientTypeAlerts: function(){},
      getStateForRecipientTypeAlerts: function(){}
    };

		mockRecipientsSvc = {
			switchStateForRecipientTypeAlerts: function(){},
			getStateForRecipientTypeAlerts: function(){}
		};

    $controller('RecipientListController', {$scope: $rootScope,possibleRecipientsSvc : mockPossibleRecipientsSvc,  recipientsSvc: mockRecipientsSvc});
  }));

  it("should attach the provided recipients to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.lesQui.length).toBe(2);
    expect($rootScope.lesQui[0]).toEqual('a');
    expect($rootScope.lesQui[1]).toEqual('b');
  });

  it("should attach the switch state method to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.switchState).toEqual(mockRecipientsSvc.switchStateForRecipientTypeAlerts);
  });

  it("should attach the switch state method to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.getState).toEqual(mockRecipientsSvc.getStateForRecipientTypeAlerts);
  });

});


describe("RecipientAlertsController", function() {
  var $rootScope;

  beforeEach(module('app/recipients'));

  beforeEach(inject(function (_$rootScope_, $controller, $q) {
    $rootScope = _$rootScope_;
    var dummyRecipients = ['a', 'b'];
    var mockAlertSvc = {
      getAllRecipientsWithSubscriptions: function (){
        return $q.when(dummyRecipients);
      }
    };
    $controller('RecipientAlertsController', {$scope: $rootScope, alertSvc: mockAlertSvc});
  }));

  it("should attach the provided recipients with subscriptions to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.recipientsWithSubscriptions.length).toBe(2);
    expect($rootScope.recipientsWithSubscriptions[0]).toEqual('a');
  });

});
