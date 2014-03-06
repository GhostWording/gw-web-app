angular.module('app/filters/StyleBarController', [])

// Display buttons to access text style options
.controller('StyleBarController', ['$scope', '$modal', function ($scope, $modal) {

    $scope.showStyleFilters = function() {
      $scope.styleFilterDialog = $modal.open({
        templateUrl: 'views/partials/styleDialog.html',
        scope: $scope,
        controller: 'StyleDialogController'
      });
    };

}]);