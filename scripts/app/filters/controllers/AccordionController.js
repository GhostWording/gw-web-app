angular.module('app/filters/AccordionController', [])
.controller('AccordionController', ['$scope','accordionSvc',  function ($scope,accordionSvc) {

//  $scope.theAccordionStatus = accordionSvc.theAccordionStatus;
//  console.log($scope.theAccordionStatus);

  //$scope.isOpen = accordionSvc.theAccordionStatus.open;
//  $scope.theAccordionStatus = accordionSvc.theAccordionStatus;
  $scope.theAccordionStatus = {};
  $scope.theAccordionStatus.open = true;
//
  console.log(" ++ " + $scope.theAccordionStatus);
  console.log(" ++ " + $scope.theAccordionStatus.open);

//  $scope.isOpen = function() {
//    return $scope.theAccordionStatus.open;
//  }
}]);