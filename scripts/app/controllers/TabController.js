angular.module('app/controllers/TabController', [])

.controller('TabController', ['$scope', 'areasSvc', function($scope, areasSvc) {

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $scope.showTabs = toState.showTabs;
    });

    $scope.currentAreaName = areasSvc.getCurrentName;

    $scope.tabs = [
      { name: 'Friends', label: 'Amis' },
      { name: 'LoveLife', label: 'Amours' },
      { name: 'Family', label: 'Famille' },
      { name: 'Addressee', label: 'Qui?' }
    ];
}]);
