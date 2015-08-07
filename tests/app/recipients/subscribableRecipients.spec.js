describe("recipientTypesSvc", function() {
	
	beforeEach(module('common/recipients'));
  beforeEach(module('common/subscriptions'));


  describe("getAll", function() {
		it("should return a promise to a list of recipients", inject(function($rootScope,$httpBackend, recipientTypesSvc) {
			var recipients;

      $httpBackend.whenGET("http://gw-static-apis.azurewebsites.net/recipients/RelationTypes.json").respond(recipientTypesSvc.getBackup());
      $httpBackend.expectGET('http://gw-static-apis.azurewebsites.net/recipients/RelationTypes.json');

			recipientTypesSvc.getBackup().then(function(_recipients_) {
				recipients = _recipients_;
			});
			// Trigger the promise to resolve
			$rootScope.$digest();
			expect(recipients).toEqual(jasmine.any(Array));
		}));
	
	});

});