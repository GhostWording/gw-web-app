describe('FavouritesListController', function() {

  beforeEach(module('app/favourites/FavouritesListController'));

  var $rootScope, mocks;
  beforeEach(module(function($provide) {
    mocks = {
      a: {TextId: 'a'},
      b: {TextId: 'b'},
      c: {TextId: 'c'}
    };
    $provide.value('favouritesSvc', {
      favourites: mocks,
      removeFavourite: jasmine.createSpy()
    });
  }));

  beforeEach(inject(function (_$rootScope_, _$controller_, $q) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $controller('FavouritesListController', {
      $scope: $rootScope
    });
  }));

  it('should convert the favourites object to an array so we can use orderBy filter', inject(function(favouritesSvc) {
    expect(angular.isArray($rootScope.favourites)).toBe(true);
    expect($rootScope.favourites[0]).toEqual({TextId: 'a'});
    expect($rootScope.favourites[1]).toEqual({TextId: 'b'});
    expect($rootScope.favourites[2]).toEqual({TextId: 'c'});
  }));

  describe('removeFavourite', function() {
    
    it('should call the removeFavourite method of the favourites service', inject(function(favouritesSvc) {
      var txt ={};
      $rootScope.removeFavourite(txt);
      expect(favouritesSvc.removeFavourite).toHaveBeenCalledWith({});
    }));

  });

});