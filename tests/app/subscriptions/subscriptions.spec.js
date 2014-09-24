describe("subscriptionsSvc", function() {

	beforeEach(module('common/recipients'));
  beforeEach(module('common/subscriptions'));
  //beforeEach(module('app/subscriptions'));
  beforeEach(module('common/users'));
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
				{"RecipientTypeTag": "9E2D23"},
				{"RecipientTypeTag": "9E2D23"},
				{"RecipientTypeTag": "9E2D23"},
				{"RecipientTypeTag": "64C63D"},
				{"RecipientTypeTag": "64C63D"}
			],
			dummyRecipients = [
				{"RecipientTypeTag": "9E2D23"},
				{"RecipientTypeTag": "87F524"},
				{"RecipientTypeTag": "64C63D"},
				{"RecipientTypeTag": "3B9BF2"}
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

    it("should return a promise to subscriptions of active recipients", inject(function(subscribedRecipientTypesSvc, subscriptionsSvc, $q, $rootScope) {
      var dummysubscribedRecipients = [
           {"RecipientTypeTag": "9E2D23"},
           {"RecipientTypeTag": "87F524"},
           {"RecipientTypeTag": "64C63D"}
          ],
          dummyRecipientsSubscriptions = [
            {"RecipientTypeTag": "9E2D23", alerts:['a','b','c']},
            {"RecipientTypeTag": "87F524", alerts:['a']},
          ],
          subscribedRecipientsSpy = spyOn(subscribedRecipientTypesSvc, "getsubscribedRecipients").andReturn($q.when(dummysubscribedRecipients)),
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

describe("SubscriptionController", function() {
  var $rootScope,
      mockRecipientsSvc;

  beforeEach(module('app/users'));
  beforeEach(module('app/subscriptions'));

  beforeEach(module('common/users'));
  beforeEach(module('common/recipients'));


  beforeEach(inject(function (_$rootScope_, $controller, $q) {
    $rootScope = _$rootScope_;
    var dummyRecipients = ['a', 'b'];

    mockSubscriptionsSvc = {
      getRecipientsWithSubscriptions: function (){
        return $q.when(dummyRecipients);
      },
      switchState: function(){},
      getState: function(){}
    };

		mockRecipientsSvc = {
			switchStateForRecipientTypeAlerts: function(){},
			getStateForRecipientTypeAlerts: function(){}
		};

    $controller('SubscriptionController', {
      $scope: $rootScope,
      subscriptionsSvc : mockSubscriptionsSvc,
      subscribedRecipientTypesSvc: mockRecipientsSvc
    });
  }));

  it("should attach the provided recipients to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.recipientsWithSubscriptions.length).toBe(2);
    expect($rootScope.recipientsWithSubscriptions[0]).toEqual('a');
    expect($rootScope.recipientsWithSubscriptions[1]).toEqual('b');
  });

  it("should attach the switch state method to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.switchState).toEqual(mockRecipientsSvc.switchState);
  });

  it("should attach the get state method to the scope", function() {
    $rootScope.$digest();
    expect($rootScope.getState).toEqual(mockRecipientsSvc.getStateFor);
  });

});


describe("SubscriptionController", function() {
  var $rootScope;

  beforeEach(module('common/recipients'));
  beforeEach(module('common/subscriptions'));

  beforeEach(module('app/users'));
  beforeEach(module('app/subscriptions'));

  beforeEach(module('common/users'));

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