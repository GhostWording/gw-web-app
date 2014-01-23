// Keeps track of our user's local profile and preferences
cherryApp.factory('UserProfileSvc', ['$cookies','$cookieStore','PostActionSvc',function ($cookies,$cookieStore,PostActionSvc) {
    // Things we know about our user
    var userGender = "I";
  var userReadsALot = "I";
  var userAge = "I";
  var userIsDemonstrative = "I"; // effusive

    // PostActionSvc should be used in calling controller

  var o = {};
    // Get and set methods use cookies to memorize user properties
  o.getUserGender = function () {
      if (userGender === "I" && $cookies.UserGender !== undefined)
          userGender = $cookies.UserGender;
      return userGender; };
    o.setUserGender = function (v) {
        PostActionSvc.gulp('Command','setUserGender' + ' : ' + v ,'UserProfile');
      userGender = v;
      $cookies.UserGender = v;
    };
    o.getUserReadsALot = function () {
        if (userReadsALot === "I" && $cookies.UserReadsALot !== undefined)
            userReadsALot = $cookies.UserReadsALot;
    return userReadsALot; };
  o.setUserReadsALot= function (v)  {
        PostActionSvc.gulp('Command','setUserReadsALot' + ' : ' + v ,'UserProfile');

    if ( v != 'T' && v != 'F' && v != 'I' )
      console.log('not a good value for userReadsALot :' + v);
    else
    {
      userReadsALot = v;
      $cookies.UserReadsALot = v;
    }
  };
  o.getUserAge = function () {
      if (userAge === "I" && $cookies.UserAge !== undefined)
          userAge = $cookies.UserAge;

    return userAge; };
  o.setUserAge= function (v)  {
        PostActionSvc.gulp('Command','setUserAge' + ' : ' + v ,'UserProfile');

    if ( v != 'under25' && v != '25to45' && v != 'over45' &&  v != 'I' )
      console.log('not a good value for userReadsALot :' + v);
    else
    {
      userAge = v;
      $cookies.UserAge = v;
    }
  };
  o.getUserIsDemonstrative = function () {
      if (userIsDemonstrative === "I" && $cookies.UserIsDemonstrative !== undefined)
          userIsDemonstrative = $cookies.UserIsDemonstrative;

    return userIsDemonstrative; };
  o.setUserIsDemonstrative = function (v)  {
        PostActionSvc.gulp('Command','setUserIsDemonstrative' + ' : ' + v ,'UserProfile');

    if ( v != 'T' && v != 'F' && v != 'I' )
      console.log('not a good value for userIsDemonstrative :' + v);
    else
    {
      userIsDemonstrative = v;
      $cookies.UserIsDemonstrative = v;
    }
  };

    return o;
}]);