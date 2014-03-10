describe("subscribableRecipientsSvc", function() {
	beforeEach(module('app/recipients'));

	describe("getAll", function() {
		it("should return a promise to a list of recipients", inject(function($rootScope, subscribableRecipientsSvc) {
			var recipients;
			subscribableRecipientsSvc.getAll().then(function(_recipients_) {
				recipients = _recipients_;
			});
			// Trigger the promise to resolve
			$rootScope.$digest();
			expect(recipients).toEqual(jasmine.any(Array));
		}));
	});

	});


	describe("activeRecipientsSvc", function() {

  // TODO: is this required here anymore? (LP)
  // Mock out the $routeParams to save us from having to load up the whole ngRoute
  beforeEach(module(function($provide) {
    $provide.value('$routeParams', {});
  }));

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

//beforeEach(module('app/users'));
describe("subscriptionsSvc", function() {

	//beforeEach(module('app/users'));
  beforeEach(module('app/recipients'));

  describe("getAllPossibleSubscriptions", function() {

    it("should return a promise to an array of possible subscriptions", inject(function($rootScope, subscribableIntentionsSvc){
      var possibleSubscriptions;
			subscribableIntentionsSvc.getAllPossibleSubscriptions().then(function(_possibleSubscriptions_) {
        possibleSubscriptions = _possibleSubscriptions_;
      });
      // Force promise to resolve
      $rootScope.$digest();
      expect(possibleSubscriptions).toEqual(jasmine.any(Array));

    }));

  });

	//beforeEach(module('app/users'));
  describe("addPossibleSubscriptionsToRecipients", function() {

    it("should return a promise to an array of alerts for each recipient", inject(function(subscribableIntentionsSvc,subscriptionsSvc, $rootScope, $q) {
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
          getAllSubscriptionsSpy = spyOn(subscribableIntentionsSvc, 'getAllPossibleSubscriptions').andReturn($q.when(dummySubscriptions));

      var resultRecipients;
			subscriptionsSvc.addPossibleSubscriptionsToRecipients(dummyRecipients).then(function(_recipients_) {
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

    it("should return a promise to subscriptions of active recipients", inject(function(activeRecipientsSvc, subscriptionsSvc, $q, $rootScope) {
      var dummyActiveRecipients = [
           {"RecipientTypeId": "9E2D23"},
           {"RecipientTypeId": "87F524"},
           {"RecipientTypeId": "64C63D"}
          ],
          dummyRecipientsSubscriptions = [
            {"RecipientTypeId": "9E2D23", alerts:['a','b','c']},
            {"RecipientTypeId": "87F524", alerts:['a']},
          ],
          activeRecipientsSpy = spyOn(activeRecipientsSvc, "getActiveRecipients").andReturn($q.when(dummyActiveRecipients)),
          subscriptionRecipientsSpy = spyOn(subscriptionsSvc, "addPossibleSubscriptionsToRecipients").andReturn(dummyRecipientsSubscriptions);
          var resultRecipients;
          subscriptionsSvc.getAllRecipientsWithSubscriptions().then(function(_resultRecipients_) {
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

    mocksubscribableRecipientsSvc = {
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

    $controller('RecipientListController', {$scope: $rootScope,subscribableRecipientsSvc : mocksubscribableRecipientsSvc,  activeRecipientsSvc: mockRecipientsSvc});
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
    $controller('RecipientAlertsController', {$scope: $rootScope, subscriptionsSvc: mockAlertSvc});
  }));

  it("should attach the provided recipients with subscriptions to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.recipientsWithSubscriptions.length).toBe(2);
    expect($rootScope.recipientsWithSubscriptions[0]).toEqual('a');
  });

});
