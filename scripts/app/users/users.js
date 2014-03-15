// Keeps track of our user's local profile and preferences
angular.module('app/users/users', [])

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
// We may not want to send email and subscriptions as cookies to the server with each request (email might be somewhat confidential and subscription may be too heavy to carry around)
// So in the end we might use local storage for all user properties
.factory('currentUserLocalData',['$rootScope','localStorage','deviceIdSvc','serverSvc',function($rootScope,localStorage,deviceIdSvc,serverSvc) {

	var key = 'currentUserLocalData' + '.' + deviceIdSvc.get();

	var currentUser = localStorage.get(key) || {
		email: null,
		subcriptions: null
	};

	$rootScope.$watch(function() { return currentUser; }, function(value, oldValue) {
		if ( value !== oldValue ) {
			localStorage.set(key, currentUser);
    }
	}, true);
  $rootScope.$watch(function() { return currentUser.subcriptions; }, function(value, oldValue) {
    if ( value !== oldValue ) {
      console.log("sendingSuscriptionsToServer");
      serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUser.subcriptions);
    }
  }, true);

  $rootScope.$on('users.subcriptionChange',function (ev,subscription) {
    currentUser.subcriptions = subscription;
  });

	return currentUser;
}])


;