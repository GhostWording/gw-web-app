angular.module('app/favourites/favouritesSvc', ['common/services/cache'])

.factory('favouritesSvc', ['localStorage', function (localStorage) {  
  
  var service = {
    
    favourites: localStorage.get('favourites'),

    addFavourite: function(favItem) {
      
      if(service.favourites) {
        if(!service.isExisting(favItem.textId)) {
          service.favourites[favItem.textId] = favItem;
        }
      }
      else {
        service.favourites = {};
        service.favourites[favItem.textId] = favItem;
      }

      service.saveFavourites();
    },

    removeFavourite: function(textId) {
      delete service.favourites[textId];
      service.saveFavourites();
    },

    isExisting: function(textId) {
      return !!service.favourites[textId];
    },

    saveFavourites: function () {
      localStorage.set('favourites', service.favourites);
    }

  };

  return service;

}]);