angular.module('app/users/WhatToDoController', [])

.controller('WhatToDoController', ['$scope', 'currentUser',  function ($scope, currentUser) {
  $scope.user = currentUser;

}]);