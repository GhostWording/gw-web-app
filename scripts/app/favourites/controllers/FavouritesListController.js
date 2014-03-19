angular.module('app/favourites/FavouritesListController', [])

.controller('FavouritesListController', ['$scope', 'favourites', function($scope, favourites) {
	$scope.favourites = favourites;
}]);