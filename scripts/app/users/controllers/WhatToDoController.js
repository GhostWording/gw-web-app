angular.module('app/users/WhatToDoController', [])

.controller('WhatToDoController', ['$scope', 'currentUser','postActionSvc',  function ($scope, currentUser,postActionSvc) {
  $scope.user = currentUser;
  postActionSvc.postActionInfo('Init','Page','WhatToDo','Init');

}]);