describe("SubscribableRecipientsController", function() {

  beforeEach(module('cherryApp'));

  it("should query for the recipients", inject(function($controller, TypesDestinatairesStatiques, $rootScope) {

    recipients = [];
    spyOn(TypesDestinatairesStatiques, 'query').andReturn(recipients);

    $controller('SubscribableRecipientsController', { $scope: $rootScope });
  
    expect(TypesDestinatairesStatiques.query).toHaveBeenCalled();
    expect($rootScope.recipients).toBe(recipients);
  }));

});