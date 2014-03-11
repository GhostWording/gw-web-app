describe("subscribableIntentionsSvc", function() {

  //beforeEach(module('app/users'));
  beforeEach(module('app/recipients/subscribableIntentions'));

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

});