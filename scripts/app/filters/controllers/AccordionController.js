angular.module('app/filters/MyAccordionController', [])
// Do not name that AccordionController : it will break ui bootstrap !!!!
.controller('MyAccordionController', ['$scope','accordionSvc',  function ($scope,accordionSvc) {
  $scope.theAccordionStatus = accordionSvc.theAccordionStatus;
}])
;