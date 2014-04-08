angular.module('app/favourites/FavouritesListController', [])

.controller('FavouritesListController', ['$scope', '$filter', 'favouritesSvc', function($scope, $filter, favouritesSvc) {
	var favourites = [];
	// convert favourites object into array so we can use orderBy
	angular.forEach(favouritesSvc.favourites, function(fav) {
		favourites.push(fav);
	});
  $scope.favourites = $filter('headerCategories')(favourites,
    function (fav1, fav2) {
      return (fav1.favouriteIntention === fav2.favouriteIntention);
    }, function (fav) {
      return fav.favouriteIntention;
    });
  $scope.removeFavourite = function(txt) {
    favouritesSvc.removeFavourite(txt);
    $scope.favourites[txt.parentIndex].items.splice($scope.favourites[txt.parentIndex].items.indexOf(txt), 1);
  };
}]);