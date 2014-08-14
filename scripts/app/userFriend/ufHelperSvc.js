angular.module('app/userFriend/ufHelperSvc', ['common/services/HelperSvc'])

.factory('ufHelperSvc', ['HelperSvc','facebookHelperSvc','DateHelperSvc','userAges',
function (HelperSvc,facebookHelperSvc,DateHelperSvc,userAges) {

  var service = {
    // Convert facebook id to our internan id format
    makeUserFriendIdFromFbId: function (fbId) {
      return "facebook:" + fbId;
    },
    makeAgeRangeFromBirthday: function (birthday) {
      var retval; // undefined by default

      return retval;
    },

    makeUserFriendFromFbFriend: function(fbFriend) {
      var key = service.makeUserFriendIdFromFbId(fbFriend.id);
      // TODO : agerange
      var retval = { 'userFriendId' : key, 'name' : fbFriend.name, 'gender' :  fbFriend.gender, 'birthday' : fbFriend.birthday, 'fbId' : fbFriend.id };
      return retval;
    },

    // TODO : update user friends when they match a fb friends with new properties

    // Create user friend list from fb friend list : not an actual list, an object with properties !
    createUFListFromFbFriends : function(fbFriendList) {
      var ufList = {};
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !ufList[key] ) {
          ufList[key] = service.makeUserFriendFromFbFriend(fbFriend);
        }
      }
      return ufList;
    },
    //  If a facebook friend has no equivalent in user friend list, make one
    addFbFriendsToUserFriendsIfAbsent : function(fbFriendList,ufList) {
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !ufList[key] )
          ufList[key] = service.makeUserFriendFromFbFriend(fbFriend);
      }
    },
    // Set relation context : amical, family, lovelife, pro...
    setUFriendContextName : function (userFriend,contextName) {
      if (! userFriend )
        return;
      // If we change context, reset recipient type
      if ( contextName != userFriend.ufContext)
        userFriend.ufRecipientTypeId = null;
      userFriend.ufContext = contextName;
    },

    // Update ufContext for all user friends that appear in a fb friend list
    updateUserFriendContextIfPresentInFbList : function(fbFriendList,ufList,ufContext) {
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( ufList[key] ) {
          service.setUFriendContextName(ufList[key],ufContext);
        }
      }
    },

    // Get array of user friends whose birthday is coming
    getNextBirthdayUserFriends: function(friendList, maxFriendsToReturn) {
      var valret = [];
      var sortedFriendsWithBirthDay = service.extractSortedFriendsWithBirthDay(friendList);
      var nextBirthdayFriends = facebookHelperSvc.extractNextBirthdayFriends (sortedFriendsWithBirthDay,maxFriendsToReturn);
      valret = nextBirthdayFriends.slice(0,maxFriendsToReturn);
      return valret;
    },

    // Take friends with a birthday property and sort them
    extractSortedFriendsWithBirthDay: function (ufList) {
      var retval = [];
      for (var friendId in  ufList) {
        var friend = ufList[friendId];
        if (friend.birthday)
          retval.push(friend);
      }
      console.log("NbFriends with birthday= " + retval.length);
      retval.sort(function (friend1, friend2) {
        return DateHelperSvc.fbCompareBirtdays(friend1, friend2);
      });
      return retval;
    },

  };

  return service;
}]);

