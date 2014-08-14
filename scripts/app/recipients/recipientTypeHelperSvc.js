angular.module('app/recipients/recipientTypeHelperSvc', [])

.factory('recipientTypeHelperSvc', [ 'dateHelperSvc', function (dateHelperSvc) {

  function recipientIsCompatibleWithCurrentUser(possibleRecipient,currentUser) {
    var valret = true;
    if ( currentUser.gender == 'H' && "SweetheartM" == possibleRecipient.Id )
      valret = false;
    if ( currentUser.gender == 'H' && "LoveInterestM" == possibleRecipient.Id )
      valret = false;
    if ( currentUser.gender == 'F' && "SweetheartF" == possibleRecipient.Id )
      valret = false;
    if ( currentUser.gender == 'F' && "LoveInterestF" == possibleRecipient.Id )
      valret = false;
    return valret;
  }

  function recipientIsCompatibleWithFbTarget(possibleRecipient,fbTargetUser) {
    var valret = true;
    if ( fbTargetUser.gender == 'female' && possibleRecipient.Gender == 'H')
      valret = false;
    if ( fbTargetUser.gender == 'male' && possibleRecipient.Gender == 'F')
      valret = false;
    return valret;
  }

  function fbMeIsCompatibleWithFbTarget(fbMe,fbTargetUser, possibleRecipientId) {
    var valret = true;
    var myAge = dateHelperSvc.fbBirthdayAge(fbMe.birthday);
    var fbFriendAge = dateHelperSvc.fbBirthdayAge(fbTargetUser.birthday);

    // Look for age incompatibilities
    if ( myAge > -1 && fbFriendAge > -1) {
      // If age difference is to big, don't suggest darling or loveinterest
      if ( possibleRecipientId == 'SweetheartF' || possibleRecipientId == 'SweetheartM' || possibleRecipientId == 'LoveInterestF' || possibleRecipientId == 'LoveInterestM'  ) {
        // Now that's arbitrary
        if ( fbFriendAge < 18 &&  myAge > fbFriendAge + 3 )
          valret = false;
        // Arbitrary again (but unlikely)
        if ( myAge > fbFriendAge + 20 || myAge < fbFriendAge - 20  )
          valret = false;
      }

      if ( possibleRecipientId == 'Mother' || possibleRecipientId == 'Father'  ) {
        // Might not hold in some countries
        if ( fbFriendAge <= myAge + 17 || fbFriendAge >= myAge + 50 )
          valret = false;
      }
      if ( possibleRecipientId == 'Sister' || possibleRecipientId == 'Brother'  ) {
        // Might not hold in some countries
        if ( fbFriendAge <= myAge - 25 || fbFriendAge >= myAge + 25 )
          valret = false;
      }
      if ( possibleRecipientId == 'ProNetwork'  ) {
        // Might not hold in some countries
        if ( fbFriendAge <= 16 || myAge <= 16 )
          valret = false;
      }
      if ( possibleRecipientId == 'CloseFriends'  ) {
        // It does happen though
        if ( fbFriendAge <= myAge - 20 || fbFriendAge >= myAge + 20 ) {
          valret = false;
        }
      }
      if ( possibleRecipientId == 'LongLostFriends'  ) {
        // It does happen though
        if ( fbFriendAge <= myAge - 25 || fbFriendAge >= myAge + 25 ) {
          valret = false;
        }
      }
      if ( possibleRecipientId == 'FamillyYoungsters'  ) {
        // It does happen though
        if ( fbFriendAge >= myAge - 17  ) {
          valret = false;
        }
      }


    }
    return valret;
  }

  var CONTEXT_RECIPIENT_MAP = {
    'friendlyContext': {'CloseFriends':true,'LoveInterestF':true,'LoveInterestM':true,'LongLostFriends':true,'OtherFriends':true},
    'familialContext': { 'SweetheartF':true,'SweetheartM':true,'Mother':true,'Father':true,'Sister':true,'Brother':true,'DistantRelatives':true,'FamillyYoungsters':true},
    'professionalContext' : { 'ProNetwork':true}
  };


  function possibleRecipientIsCompatibleWithContext(possibleRecipient, currentContextName) {
    var possibleRecipientsForContext = CONTEXT_RECIPIENT_MAP[currentContextName];
    var valret = !!possibleRecipientsForContext[possibleRecipient.Id];
    return valret;
  }

  var service = {
    getCompatibleRecipients: function (possibleRecipients, currentUser, fbTargetUser, fbMe, currentContextName) {
      var retval = [];
      for (var i = 0; i < possibleRecipients.length; i++ ) {
        var recipient = possibleRecipients[i];
        if ( recipientIsCompatibleWithCurrentUser(recipient,currentUser) === false )
          continue;
        if ( fbTargetUser && recipientIsCompatibleWithFbTarget(recipient, fbTargetUser) === false )
          continue;
        if ( fbTargetUser && fbMe && fbMeIsCompatibleWithFbTarget(fbMe, fbTargetUser,recipient.Id) === false )
          continue;
        if ( currentContextName &&  possibleRecipientIsCompatibleWithContext(recipient, currentContextName) === false   )
          continue;
        retval.push(recipient);
      }
      return retval;
    },
    getRecipientById : function(possibleRecipients,id) {
      var retval = null;
      for (var i = 0; i < possibleRecipients.length; i++ ) {
        var recipient = possibleRecipients[i];
        if ( recipient.Id == id )
          return recipient;
      }
      return retval;
    }
  };
  return service;
}]);
