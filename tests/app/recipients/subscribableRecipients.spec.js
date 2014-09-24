describe("recipientTypesSvc", function() {
	
	beforeEach(module('common/recipients'));
  beforeEach(module('common/subscriptions'));


  describe("getAll", function() {
		it("should return a promise to a list of recipients", inject(function($rootScope, recipientTypesSvc) {
			var recipients;
			recipientTypesSvc.getAll().then(function(_recipients_) {
				recipients = _recipients_;
			});
			// Trigger the promise to resolve
			$rootScope.$digest();
			expect(recipients).toEqual(jasmine.any(Array));
		}));
	
	});

});