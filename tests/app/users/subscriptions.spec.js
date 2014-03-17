describe("subscriptionsSvc", function() {

	beforeEach(module('app/recipients'));
  beforeEach(module('app/users'));
  beforeEach(module('common/services/deviceIdSvc'));

	describe("getLikelyIntentionsForRecipients", function() {

		it("should return a promise to an array of possible subscriptions", inject(function($rootScope, likelyIntentionsSvc){
			var possibleSubscriptions;
			likelyIntentionsSvc.getLikelyIntentionsForRecipients().then(function(_possibleSubscriptions_) {
				possibleSubscriptions = _possibleSubscriptions_;
			});
      // Force promise to resolve
      $rootScope.$digest();
      expect(possibleSubscriptions).toEqual(jasmine.any(Array));

    }));

	});

	describe("mergePossibleRecipientsWithPreviousSubscribedRecipients", function() {

		it("should return a promise to an array of alerts for each recipient", inject(function(likelyIntentionsSvc,subscriptionsSvc, $rootScope, $q) {
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
			getAllSubscriptionsSpy = spyOn(likelyIntentionsSvc, 'getIntentionsThatCanBeSubscribedForRecipients').andReturn($q.when(dummySubscriptions));

			var resultRecipients;
			subscriptionsSvc.mergePossibleRecipientsWithPreviousSubscribedRecipients(dummyRecipients).then(function(_recipients_) {
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

    it("should return a promise to subscriptions of active recipients", inject(function(subscribedRecipientsSvc, subscriptionsSvc, $q, $rootScope) {
      var dummysubscribedRecipients = [
           {"RecipientTypeId": "9E2D23"},
           {"RecipientTypeId": "87F524"},
           {"RecipientTypeId": "64C63D"}
          ],
          dummyRecipientsSubscriptions = [
            {"RecipientTypeId": "9E2D23", alerts:['a','b','c']},
            {"RecipientTypeId": "87F524", alerts:['a']},
          ],
          subscribedRecipientsSpy = spyOn(subscribedRecipientsSvc, "getsubscribedRecipients").andReturn($q.when(dummysubscribedRecipients)),
          subscriptionRecipientsSpy = spyOn(subscriptionsSvc, "mergePossibleRecipientsWithPreviousSubscribedRecipients").andReturn(dummyRecipientsSubscriptions);
          var resultRecipients;
          subscriptionsSvc.getRecipientsWithSubscriptions().then(function(_resultRecipients_) {
            resultRecipients = _resultRecipients_;
          });
          $rootScope.$digest();
          expect(resultRecipients.length).toEqual(2);
          expect(resultRecipients[0].alerts.length).toEqual(3);
          expect(resultRecipients[1].alerts.length).toEqual(1);
    }));

  });

});

describe("SubscribableRecipientsController", function() {
  var $rootScope,
      mockRecipientsSvc;

  beforeEach(module('app/users'));
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

    $controller('SubscribableRecipientsController', {$scope: $rootScope,subscribableRecipientsSvc : mocksubscribableRecipientsSvc,  subscribedRecipientsSvc: mockRecipientsSvc});
  }));

  it("should attach the provided recipients to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.recipients.length).toBe(2);
    expect($rootScope.recipients[0]).toEqual('a');
    expect($rootScope.recipients[1]).toEqual('b');
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


describe("SubscriptionController", function() {
  var $rootScope;

  beforeEach(module('app/recipients'));
  beforeEach(module('app/users'));
  beforeEach(module('common/services/deviceIdSvc'));
  beforeEach(module('common/services/server'));

  beforeEach(inject(function (_$rootScope_, $controller, $q) {
    $rootScope = _$rootScope_;
    var dummyRecipients = ['a', 'b'];
    var mockAlertSvc = {
      getRecipientsWithSubscriptions: function (){
        return $q.when(dummyRecipients);
      }
    };
    $controller('SubscriptionController', {$scope: $rootScope, subscriptionsSvc: mockAlertSvc});
  }));

  it("should attach the provided recipients with subscriptions to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.recipientsWithSubscriptions.length).toBe(2);
    expect($rootScope.recipientsWithSubscriptions[0]).toEqual('a');
  });

});