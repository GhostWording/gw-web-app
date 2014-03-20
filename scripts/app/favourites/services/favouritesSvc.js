angular.module('app/favourites/favouritesSvc', ['common/services/cache'])

.factory('favouritesSvc', ['localStorage', function (localStorage) {	
	
	var service = {
		
		favourites: localStorage.get('favourites'),

		addFavourite: function(favItem) {
			
			if(service.favourites) {
				if(!service.isExistingFavourite(service.favourites, 'textId', favItem.textId)) {
					service.favourites.push(favItem);	
				}
			}
			else {
				service.favourites = [favItem];
			}

			service.setFavourites(service.favourites);
		},

		removeFavourite: function(favourites, key, currentItem) {
			angular.forEach(favourites, function(fav) {
				if(currentItem === fav[key]) {
					favourites.splice(favourites.indexOf(fav), 1);
					service.setFavourites(favourites);
				}
			});
		},

		isExistingFavourite: function(favourites, key, currentItem) {
			var found = false;
			angular.forEach(favourites, function(fav) {
				if(currentItem === fav[key]) {
					found = true;
					return;
				}
			});
			return found;
		},

		setFavourites: function (favourites) {
			localStorage.set('favourites', favourites);
		}

	};

	return service;

}]);