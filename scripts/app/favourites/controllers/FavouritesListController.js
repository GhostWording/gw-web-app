angular.module('app/favourites/FavouritesListController', [])

.controller('FavouritesListController', ['$scope', 'favourites', function($scope, favourites) {
	$scope.favourites = [];
	// convert favourites object into array so we can use orderBy
	angular.forEach(favourites, function(fav) {
		$scope.favourites.push(fav);
	});
}]);