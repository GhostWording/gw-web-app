angular.module('app/favourites/favouritesSvc', ['common/services/cache'])

.factory('favouritesSvc', ['localStorage', function (localStorage) {  
  
  var service = {
    
    favourites: localStorage.get('favourites'),

    addFavourite: function(fav) {
      
      if(service.favourites) {
        if(!service.isExisting(fav)) {
          service.favourites[fav.TextId] = fav;
        }
      }
      else {
        service.favourites = {};
        service.favourites[fav.TextId] = fav;
      }

      service.saveFavourites();
    },

    removeFavourite: function(txt) {
      delete service.favourites[txt.TextId];
      service.saveFavourites();
    },

    isExisting: function(txt) {
      // This check is necessary in case favourites are empty
      // where favourites[txt.TextId] would throw an error
      // since it would try to find a key of a null object
      if(service.favourites) {
        return !!service.favourites[txt.TextId];
      }
      else {
        return false;
      }
    },

    saveFavourites: function () {
      localStorage.set('favourites', service.favourites);
    },

    setFavourite: function (txt, area, intention, recipient, isFav) {
      if(isFav) {
        service.removeFavourite(txt);
      }
      else {
        var fav = {
          TextId: txt.TextId,
          IntentionId: intention.IntentionId,
          AreaId: area.AreaId,
          RecipientId: recipient,
          favouriteText: txt.Content,
          favouriteIntention: intention.Label,
          favouriteArea: area.Name,
          favouriteDate: new Date()
        };
        service.addFavourite(fav); 
      }
    }

  };

  return service;

}]);