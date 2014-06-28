angular.module('app/filters/AccordionOptionController', [])
.controller('AccordionOptionController', ['$scope',  function ($scope) {


  $scope.accordionStatus = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
  $scope.isOpen = true;
  console.log($scope.isOpen);
}]);