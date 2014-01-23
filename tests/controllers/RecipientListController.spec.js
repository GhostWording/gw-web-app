describe("RecipientListController", function() {
  var $scope, recipientSvc, recipients;

  beforeEach(module('cherryApp'));

  beforeEach(inject(function($controller) {
    
    $scope = {
      Tabs: {}
    };
    
    recipients = [];

    recipientSvc = {
      query: jasmine.createSpy('recipient query').andReturn(recipients)
    };
  
    $controller('RecipientListController', { $scope: $scope, TypesDestinatairesStatiques: recipientSvc });
  
  }));
  

  it("should set up the tabs", function() {

    expect($scope.Tabs).toEqual({
      showTabs: true,
      tabNumber: 2
    });

  });

  it("should query for the recipients", function() {
    expect(recipientSvc.query).toHaveBeenCalled();
    expect($scope.lesQui).toBe(recipients);
  });

});