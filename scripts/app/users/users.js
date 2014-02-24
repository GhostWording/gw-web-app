// Keeps track of our user's local profile and preferences
angular.module('app/users', [])

.factory('currentUser', ['$rootScope', '$cookieStore', function ($rootScope, $cookieStore) {

  var currentUser = $cookieStore.get('users.currentUser') || {
    gender: null,
    readsAlot: null,
    age: null,
    isDemonstrative: null
  };

  $rootScope.$watch(function() { return currentUser; }, function(value, oldValue) {
    if ( value !== oldValue ) {
      $cookieStore.put('users.currentUser', currentUser);
    }
  }, true);

  return currentUser;

}])

.controller('UserProfileController', ['$scope', 'currentUser', function ($scope, currentUser) {
  $scope.userProfile = currentUser;
}]);