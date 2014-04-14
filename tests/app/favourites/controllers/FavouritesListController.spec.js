describe('FavouritesListController', function() {

  beforeEach(module('app/favourites/FavouritesListController'));

  var $rootScope, mocks;
  beforeEach(module('common/filters/headerCategories'));
  beforeEach(module(function($provide) {
    mocks = {
      a: {TextId: 'a', favouriteIntention: 'one'},
      b: {TextId: 'b', favouriteIntention: 'one'},
      c: {TextId: 'c', favouriteIntention: 'two'}
    };
    $provide.value('favouritesSvc', {
      favourites: mocks,
      removeFavourite: jasmine.createSpy()
    });
  }));

  beforeEach(inject(function (_$rootScope_, _$controller_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $controller('FavouritesListController', {
      $scope: $rootScope
    });
  }));

  it('should convert the favourites object to an array so we can use orderBy filter', function() {
    expect(angular.isArray($rootScope.favourites)).toBe(true);
  });

  it('should group the favourites by intention', function () {
    expect($rootScope.favourites[0].id).toEqual('one');
    expect($rootScope.favourites[1].id).toEqual('two');
    expect($rootScope.favourites[0].items.length).toEqual(2);
    expect($rootScope.favourites[1].items.length).toEqual(1);
  });

  describe('removeFavourite', function() {
    
    it('should call the removeFavourite method of the favourites service', inject(function(favouritesSvc) {
      var txt ={parentIndex: 0, TextId: 'a'};
      $rootScope.removeFavourite(txt);
      expect(favouritesSvc.removeFavourite).toHaveBeenCalledWith(txt);
    }));

    it('should splice the item of the favourites array', function() {
      expect($rootScope.favourites[0].items.length).toEqual(2);
      var txt ={parentIndex: 0, TextId: 'a'};
      $rootScope.removeFavourite(txt);
      expect($rootScope.favourites[0].items.length).toEqual(1);
    });

  });

});