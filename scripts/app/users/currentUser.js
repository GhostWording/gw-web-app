// Keeps track of our user's local profile and preferences stored through cookies
angular.module('app/users/currentUser', [
  'common/services/deviceIdSvc',
  'common/services/HelperSvc',
  'app/users/userAges'
])
//.value('userAges', {
//  under18: 'under18',
//  between18and39: 'between18and39',
//  between40and64: 'between40and64',
//  from65ToInfinity: 'from65ToInfinity'
//})
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
      if ( fbAge >= 13 && fbAge < 18 )
        that.age = userAges.under18;
      else if (fbAge >= 18 && fbAge < 40)
        that.age = userAges.between18and39;
      else if (fbAge >= 40 && fbAge < 65)
        that.age = userAges.between40and64;
      else if ( fbAge >= 65 )
        that.age = userAges.from65ToInfinity;
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