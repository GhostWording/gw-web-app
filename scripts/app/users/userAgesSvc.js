angular.module('app/users/userAges', [])
.value('userAges', {
  under18: 'under18',
  between18and39: 'between18and39',
  between40and64: 'between40and64',
  from65ToInfinity: 'from65ToInfinity'
})
.factory('userAgesHelperSvc', ['userAges', function (userAges) {
  var AGERANGE_TAG_MAP = {
    'under18': 'C2D9A4',
    'between18and39':'5D79C9',
    'between40and64':'FC0342',
    'from65ToInfinity':'AE098F'
  };

  var service = {
    convertAgeToAgeRange: function (age) {
      if ( !age ||age <= 0 )
        return undefined;
      if ( age < 18 )
        return userAges.under18;
      if ( age >= 18 && age <= 39)
        return userAges.between18and39;
      if ( age >= 40 && age <= 64)
        return userAges.between40and64;
      if ( age >= 65 )
        return userAges.from65ToInfinity;
      console.log("!!!!!! convertAgeToUserAge got unexpected age  !!!!!!! : " + age);
      return undefined;
    },
    getTagForAgeRange: function(userAgeRange) {
      return AGERANGE_TAG_MAP[userAgeRange];
    },
    getAgeTagForAge: function(age) {
      var range = service.convertAgeToAgeRange(age);
      var retval = service.getTagForAgeRange(range);
      return retval;
    }

  };
  return service;

}]);
