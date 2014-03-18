angular.module('app/favourites', ['common/services/cache'])

.factory('favouritesSvc', ['localStorage', function (localStorage) {	
	
	var service = {
		
		favourites: localStorage.get('favourites'),

		addFavourite: function(favItem) {
			
			if(service.favourites) {
				if(!service.isExistingFavourite(service.favourites, 'favouriteText', favItem.favouriteText)) {
					service.favourites.push(favItem);	
				}
			}
			else {
				service.favourites = [favItem];
			}

			service.setFavourites(service.favourites);
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