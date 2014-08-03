// Keeps track of our user's local profile and preferences stored through cookies
angular.module('app/users/currentUser', [
  'common/services/deviceIdSvc',
  'common/services/HelperSvc'
])

.value('userAges', {
  under25: 'under25',
  between25and45: '25to45',
  over45: 'over45'
})
.factory('currentUser', ['$rootScope', '$cookieStore', 'HelperSvc','userAges', function ($rootScope, $cookieStore,HelperSvc,userAges) {

  var currentUser = $cookieStore.get('users.currentUser') || {
    gender: null,
    readsAlot: null,
    age: null,
    isDemonstrative: null
  };

  currentUser.setPropertiesFromFbMe = function (me) {
    if (!me)
      return;
    var fbGender = me.gender;
    if ( !this.gender && !!fbGender ) {
      if ( fbGender ==  'male')
        this.gender = 'H';
      if ( fbGender ==  'female')
        this.gender = 'F';
    }
    if ( !this.age && me.birthday ) {
      var fbAge = HelperSvc.fbBirthdayAge(me.birthday);
      if ( fbAge > 13 && fbAge < 25 )
        this.age = userAges.under25;
      else if (fbAge >= 25 && fbAge <= 45)
        this.age = userAges.between25and45;
      else if ( fbAge > 45 )
        this.age = userAges.over45;
    }
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