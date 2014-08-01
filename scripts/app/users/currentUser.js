// Keeps track of our user's local profile and preferences stored through cookies
angular.module('app/users/currentUser', [
  'common/services/deviceIdSvc'
])

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

  currentUser.clear = function() {
    $cookieStore.remove('users.currentUser');
  };

  $rootScope.$watch(function() { return currentUser; }, function(value, oldValue) {

    if ( value !== oldValue ) {
      $cookieStore.put('users.currentUser', currentUser);
    }
  }, true);

  return currentUser;
}])

;