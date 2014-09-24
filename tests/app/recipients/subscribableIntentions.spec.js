describe("likelyIntentionsSvc", function() {

  beforeEach(module('common/recipients'));


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

});