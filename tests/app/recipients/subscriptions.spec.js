describe("subscriptionsSvc", function() {

	beforeEach(module('app/recipients/subscriptions'));

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

  beforeEach(module('app/recipients/subscriptions'));

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

  beforeEach(module('app/recipients/subscriptions'));

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