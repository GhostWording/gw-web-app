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
        a: {TextId: 'a'},
        b: {TextId: 'b'},
        c: {TextId: 'c'}
      };
    }));

    it('should return false if current favourite does not exist in the favourites array', inject(function(favouritesSvc) {
      var currentFavourite = {
        TextId: 'd'
      };
      expect(favouritesSvc.isExisting(currentFavourite)).toEqual(false);
    }));

    it('should return true if current favourite exists in the favourites array', inject(function(favouritesSvc) {
      var currentFavourite = {
        TextId: 'a'
      };
      expect(favouritesSvc.isExisting(currentFavourite)).toEqual(true);
    }));

    it('should return false if favourites object is not set', inject(function(favouritesSvc) {
      delete favouritesSvc.favourites;
      expect(favouritesSvc.isExisting()).toBe(false);
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
        TextId: 'a'
      };
      expect(favouritesSvc.favourites).toBe(null);
      favouritesSvc.addFavourite(currentFavourite);
      expect(favouritesSvc.favourites).toEqual({a: {TextId: 'a'}});
    }));

    it('should add an additional favourite to the favourites object', inject(function(favouritesSvc) {
      favouritesSvc.favourites = {
        a: {TextId: 'a'},
        b: {TextId: 'b'}
      };
      var currentFavourite = {
        TextId: 'c'
      };
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
      expect(favouritesSvc.favourites['c']).toBe(undefined);
      favouritesSvc.addFavourite(currentFavourite);
      expect(favouritesSvc.favourites['c']).toEqual({TextId: 'c'});
      expect(objLength(favouritesSvc.favourites)).toEqual(3);
    }));

    it('should not add an additional favourite to the favourites object if it already exists', inject(function(favouritesSvc) {
      favouritesSvc.favourites = {
        a: {TextId: 'a'},
        b: {TextId: 'b'}
      };
      var currentFavourite = {
        TextId: 'a'
      };
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
      favouritesSvc.addFavourite(currentFavourite);
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
    }));

  });

  describe('removeFavourite', function() {

    beforeEach(inject(function(favouritesSvc) {
      favouritesSvc.favourites = {
        a: {TextId: 'a'},
        b: {TextId: 'b'},
        c: {TextId: 'c'}
      };
    }));

    it('should remove a favourite from the favourites object', inject(function(favouritesSvc) {
      var currentFavourite = {
        TextId: 'b'
      };
      favouritesSvc.removeFavourite(currentFavourite);
      expect(objLength(favouritesSvc.favourites)).toEqual(2);
      expect(favouritesSvc.favourites[currentFavourite]).toBe(undefined);
    }));

    it('should not remove a favourite from the favourites object if the item does not exist', inject(function(favouritesSvc) { 
      var currentFavourite = {
       TextId: 'd'
      };
      favouritesSvc.removeFavourite(currentFavourite);
      expect(objLength(favouritesSvc.favourites)).toEqual(3);
    }));

    it('should call the save favourites method', inject(function(favouritesSvc) {
      var currentFavourite = {
        TextId: 'b'
      };
      spyOn(favouritesSvc, 'saveFavourites');
      favouritesSvc.removeFavourite(currentFavourite);
      expect(favouritesSvc.saveFavourites).toHaveBeenCalled();
    }));

  });

  describe('setFavourite', function() {
    var intention = {
      IntentionId: '123',
      Label: 'intentionLabel'
    };
    var area = {
      Name: 'areaName'
    };
    var recipientId = '123';

    it('should unfavourite a text if it is currently a favourite', inject(function(favouritesSvc) {
      var removeFavSpy = spyOn(favouritesSvc, 'removeFavourite');
      var txt = {
        TextId: 'd',
        Content: 'this is text d'
      };
      favouritesSvc.setFavourite(txt, area.Name, intention, true);
      expect(removeFavSpy).toHaveBeenCalledWith(txt);
    }));

    it('should favourite a text if it is currently not a favourite', inject(function(favouritesSvc) {
      var addFavSpy = spyOn(favouritesSvc, 'addFavourite');
      var txt = {
        TextId: 'd',
        Content: 'this is text d'
      };
      favouritesSvc.setFavourite(txt, area.Name, intention, false);
      var fav = {
        TextId: txt.TextId,
        IntentionId: intention.IntentionId,
        //RecipientId: recipientId,
        favouriteText: txt.Content,
        favouriteIntention: intention.Label,
        favouriteArea: area.Name,
        favouriteDate: new Date()
      };
      expect(addFavSpy).toHaveBeenCalledWith(fav);
    }));

  });

});