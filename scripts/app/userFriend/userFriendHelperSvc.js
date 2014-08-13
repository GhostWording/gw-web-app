angular.module('app/userFriend/userFriendHelperSvc', ['common/services/HelperSvc'])

.factory('userFriendHelperSvc', ['HelperSvc','filterHelperSvc','filteredTextsHelperSvc','facebookHelperSvc','DateHelperSvc',
  function (HelperSvc,filterHelperSvc,filteredTextsHelperSvc,facebookHelperSvc,DateHelperSvc) {

  var service = {

    makeUserFriendIdFromFbId: function (fbId) {
      return "facebook:" + fbId;
    },

    makeUserFriendFromFbFriend: function(fbFriend) {
      var key = service.makeUserFriendIdFromFbId(fbFriend.id);
      var retval = { 'userFriendId' : key, 'name' : fbFriend.name, 'gender' :  fbFriend.gender, 'birthday' : fbFriend.birthday, 'fbId' : fbFriend.id };
      return retval;
    },

    // this takes an object with properties
    extractSortedFriendsWithBirthDay: function (friendsToSort) {
      var retval = [];
      for (var friendId in  friendsToSort) {
        var friend = friendsToSort[friendId];
        if (friend.birthday)
          retval.push(friend);
      }
      console.log("NbFriends with birthday= " + retval.length);
      retval.sort(function (friend1, friend2) {
        return DateHelperSvc.fbCompareBirtdays(friend1, friend2);
      });
      return retval;
    },

    getNextBirthdayFriends: function(friendList, maxFriendsToReturn) {
      var valret = [];
      //if ( friendList.length > 0 ) {
        var sortedFriendsWithBirthDay = service.extractSortedFriendsWithBirthDay(friendList);
        var nextBirthdayFriends = facebookHelperSvc.extractNextBirthdayFriends (sortedFriendsWithBirthDay,maxFriendsToReturn);
        valret = nextBirthdayFriends.slice(0,maxFriendsToReturn);
      //}
      return valret;
    },

    // TODO : should create userFriend object, then watch for changes on context and on recipient type
    addFbFriendsToUserFriends : function(fbFriendList,uFriendList) {
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !uFriendList[key] ) {
          uFriendList[key] = service.makeUserFriendFromFbFriend(fbFriend);
        }
      }
    },
    createUFListFromFbFriends : function(fbFriendList) {
      var uFriendList = {};
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !uFriendList[key] ) {
          uFriendList[key] = service.makeUserFriendFromFbFriend(fbFriend);
        }
      }
      return uFriendList;
    },

    addFamilyMembersOrUpdateFamilialContext : function(fbFamily,uFriendList) {
      for (var i= 0; i < fbFamily.length; i++ ) {
        var fbFriend = fbFamily[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !uFriendList[key] ) {
          uFriendList[key] = service.makeUserFriendFromFbFriend(fbFriend);
          uFriendList[key].ufContext = 'familialContext';
        }
        else {
          uFriendList[key].ufContext = 'familialContext';
        }
      }
    },

    setUFriendContextName : function (userFriend,contextName) {
      if (! userFriend )
        return;
      // If we change context, reset recipient type
      if ( contextName != userFriend.ufContext)
        userFriend.ufRecipientTypeId = null;
      userFriend.ufContext = contextName;
    },


  };

  return service;
}]);

