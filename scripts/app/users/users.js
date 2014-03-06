// Keeps track of our user's local profile and preferences
angular.module('app/users', [])

.value('userAges', {
  under25: 'under25',
  between25and45: '25to45',
  over45: 'over45'
})

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

.controller('UserProfileController', ['$scope', 'currentUser', 'userAges', function ($scope, currentUser, userAges) {
  $scope.currentUser = currentUser;
  $scope.userAges = userAges;
}])

.controller('UserEMailController', ['$scope', 'currentUser',  function ($scope, currentUser) {
}]);