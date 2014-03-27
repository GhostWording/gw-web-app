describe('favouritesSvc', function() {

  beforeEach(module('app/favourites'));

  //Helper function to find how many favourites we have
  //so we can test if new ones are added.
  function objLength(obj) {
    var length = 0;
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        length ++;
      }
    }
    return length;
  }

  describe('isExistingFavourite', function() {
    beforeEach(inject(function(favouritesSvc) {
      favouritesSvc.favourites = {
        a: {textId: 'a'},
        b: {textId: 'b'},
        c: {textId: 'c'}
      };
    }));

    it('should return false if current favourite does not exist in the favourites array', inject(function(favouritesSvc) {
      expect(favouritesSvc.isExisting('d')).toEqual(false);
    }));

    it('should return true if current favourite exists in the favourites array', inject(function(favouritesSvc) {
      expect(favouritesSvc.isExisting('a')).toEqual(true);
    }));

  });

  describe('saveFavourites', function() {

    it('should set the favourites entry of localStorage with the correct argument', inject(function(favouritesSvc, localStorage) {
      favouritesSvc.favourites = [];
      spyOn(localStorage, 'set');
      favouritesSvc.saveFavourites();
      expect(localStorage.set).toHaveBeenCalledWith('favourites', []);
    }));

  });

  describe('addFavourite', function() {

    it('should set favourites with current item if there are no other favourites', inject(function(favouritesSvc) {
      favouritesSvc.favourites = null;
      var currentFavourite = {
        textId: 'a'
      };
      expect(favouritesSvc.favourites).toBe(null);
      favouritesSvc.addFavourite(currentFavourite);
      expect(favouritesSvc.favourites).toEqual({a: {textId: 'a'}});
    }));

    it('should add an additional favourite to the favourites object', inject(function(favouritesSvc) {
      favouritesSvc.favourites = {
        a: {textId: 'a'},
        b: {textId: 'b'}
      };
      var currentFavourite = {
        textId: 'c'
      };
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
      expect(favouritesSvc.favourites['c']).toBe(undefined);
      favouritesSvc.addFavourite(currentFavourite);
      expect(favouritesSvc.favourites['c']).toEqual({textId: 'c'});
      expect(objLength(favouritesSvc.favourites)).toEqual(3);
    }));

    it('should not add an additional favourite to the favourites object if it already exists', inject(function(favouritesSvc) {
      favouritesSvc.favourites = {
        a: {textId: 'a'},
        b: {textId: 'b'}
      };
      var currentFavourite = {
        textId: 'a'
      };
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
      favouritesSvc.addFavourite(currentFavourite);
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
    }));

  });

  describe('removeFavourite', function() {

    beforeEach(inject(function(favouritesSvc) {
      favouritesSvc.favourites = {
        a: {textId: 'a'},
        b: {textId: 'b'},
        c: {textId: 'c'}
      };
    }));

    it('should remove a favourite from the favourites object', inject(function(favouritesSvc) {
      var currentFavourite = {
        textId: 'b'
      };
      favouritesSvc.removeFavourite('b');
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
      expect(favouritesSvc.favourites['b']).toBe(undefined);
    }));

    it('should not remove a favourite from the favourites object if the item does not exist', inject(function(favouritesSvc) { 
      var currentFavourite = {
       textId: 'd'
      };
      favouritesSvc.removeFavourite('d');
      expect(objLength(favouritesSvc.favourites)).toEqual(3);
    }));

    it('should call the save favourites method', inject(function(favouritesSvc) {
      var currentFavourite = {
        textId: 'b'
      };
      spyOn(favouritesSvc, 'saveFavourites');
      favouritesSvc.removeFavourite('b');
      expect(favouritesSvc.saveFavourites).toHaveBeenCalled();
    }));

  });

});