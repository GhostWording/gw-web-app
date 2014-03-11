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