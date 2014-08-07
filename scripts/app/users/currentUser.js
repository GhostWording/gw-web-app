// Keeps track of our user's local profile and preferences stored through cookies
angular.module('app/users/currentUser', [
  'common/services/deviceIdSvc',
  'common/services/HelperSvc'
])

//.value('userAges', {
//  under25: 'under25',
//  between25and45: '25to45',
//  over45: 'over45'
//})
.value('userAges', {
  under18: 'under18',
  under21: 'under21',
  between21and39: 'between21and39',
  from40ToInfinity: 'from40ToInfinity'
})
.factory('currentUser', ['$rootScope', '$cookieStore', 'HelperSvc','userAges','DateHelperSvc', function ($rootScope, $cookieStore,HelperSvc,userAges,DateHelperSvc) {

  var currentUser = $cookieStore.get('users.currentUser') || {
    gender: null,
    readsAlot: null,
    age: null, // TODO : replace with ageRange
    isDemonstrative: null
  };

  currentUser.setPropertiesFromFbMe = function (me) {
    if (!me)
      return;
    var fbGender = me.gender;
    var that = this;//////
    if ( !that.gender && !!fbGender ) {
      if ( fbGender ==  'male')
        that.gender = 'H';
      if ( fbGender ==  'female')
        that.gender = 'F';
    }
    if ( !(that.age) && me.birthday ) {
      var fbAge = DateHelperSvc.fbBirthdayAge(me.birthday);
      if ( fbAge > 13 && fbAge < 25 )
        that.age = userAges.under25;
      else if (fbAge >= 25 && fbAge <= 45)
        that.age = userAges.between25and45;
      else if ( fbAge > 45 )
        that.age = userAges.over45;
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