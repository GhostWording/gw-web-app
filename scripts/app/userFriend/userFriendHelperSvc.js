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

    findUserFriendInList:  function (listName, ufriendList, fbId) {
      var valret = null;
      if (listName != 'birthdayList') {
        console.log('not implemented !!!!!!');
        return valret;
      }
      return ufriendList[service.makeUserFriendIdFromFbId(fbId)];
    },

    // TODO : should create userFriend object, then watch for changes on context and on recipient type
    addFbFriendsToUserFriends : function(fbFriendList,uFriendList) {
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !uFriendList[key] ) {
          //uFriendList[key] = { 'userFriendId' : key, 'name' : fbFriend.name, 'gender' :  fbFriend.gender, 'birthday' : fbFriend.birthday, 'fbId' : fbFriend.id };
          uFriendList[key] = service.makeUserFriendFromFbFriend(fbFriend);
        }
      }
    },
    addFamilyMembersOrUpdateFamilialContext : function(fbFamily,uFriendList) {
      for (var i= 0; i < fbFamily.length; i++ ) {
        var fbFriend = fbFamily[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !uFriendList[key] ) {
          uFriendList[key] = service.makeUserFriendFromFbFriend(fbFriend);
        }
        else {
          uFriendList[key].ufContext = 'familialContext';
        }
      }
    },

    updateUFriendFilteredTextList : function(userFriend,currentUser) {
      if (! userFriend )
        return;
      userFriend.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(userFriend.textList, currentUser, userFriend.filters.preferredStyles, userFriend.filters);
    },

    setUFriendRecipientTypeFilter: function (userFriend, recipientTypeTag, currentUser) {
      if (!userFriend)
        return;
      filterHelperSvc.setRecipientTypeTag(userFriend.filters, recipientTypeTag);
      service.updateUFriendFilteredTextList(userFriend, currentUser);
    },
    setUFriendGenderFilter : function (userFriend,currentUser) {
      if (! userFriend )
        return;
      if (!!userFriend.gender) {
        userFriend.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(userFriend.gender);
        service.updateUFriendFilteredTextList (userFriend,currentUser);
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

    setUFriendContextFilter : function (userFriend, contextName, availableContextsStyles,currentUser) {
      if ( !userFriend )
        return;
      userFriend.ufContext = contextName;
      var contextStyle = availableContextsStyles.stylesByName[userFriend.ufContext];
      filterHelperSvc.setContextTypeTag(userFriend.filters, contextStyle);
      service.updateUFriendFilteredTextList (userFriend,currentUser);
    },

    guessUFriendFamilialContextAndSetFilterFromFbFamilyList : function (userFriend, fbFamilyList, availableContextsStyles,currentUser) {
      if (!userFriend || !fbFamilyList)
        return;
      if (facebookHelperSvc.friendListContainsFriend(fbFamilyList, userFriend.fbId)) {
        console.log(userFriend.name + " is family");
        service.setUFriendContextFilter(userFriend, "familialContext", availableContextsStyles,currentUser);
      }
    },
    initializeTextListForUserFriends : function (userFriendList, textList,availableContextsStyles,fbFriendList,currentUser) {
      for (var key in userFriendList) {
        var userFriend = userFriendList[key];
        // Initialize text list
        // TODO : text list will go in poster
        userFriend.textList = textList;
        // Initialize filters
        userFriend.filters = filterHelperSvc.createEmptyFilters();
        // TODO : set filters from what we know
        // Set gender filter
        service.setUFriendGenderFilter(userFriend,currentUser);
        // Set context filter to family if friend is in family list
        service.guessUFriendFamilialContextAndSetFilterFromFbFamilyList(userFriend,fbFriendList,availableContextsStyles,currentUser);
        // Do the filtering
        service.updateUFriendFilteredTextList(userFriend,currentUser);
      }
    },
//    initializeFiltersForUserFriends : function (userFriend, availableContextsStyles,fbFriendList,currentUser) {
//      // Initialize filters
//      userFriend.filters = filterHelperSvc.createEmptyFilters();
//      // TODO : set filters from what we know
//      // Set gender filter
//      service.setUFriendGenderFilter(userFriend,currentUser);
//      // Set context filter to family if friend is in family list
//      service.guessUFriendFamilialContextFilterFromFbFamilyList(userFriend,fbFriendList,availableContextsStyles,currentUser);
//      // Do the filtering
//      service.updateUFriendFilteredTextList(userFriend,currentUser);
//    }

  };

  return service;
}]);

