angular.module('app/favourites/FavouritesListController', [])

.controller('FavouritesListController', ['$scope', 'favouritesSvc', function($scope, favouritesSvc) {
	$scope.favourites = [];
	// convert favourites object into array so we can use orderBy
	angular.forEach(favouritesSvc.favourites, function(fav) {
		$scope.favourites.push(fav);
	});

  $scope.removeFavourite = function(txt) {
    favouritesSvc.removeFavourite(txt);
    $scope.favourites.splice($scope.favourites.indexOf(txt), 1);
  };
}]);