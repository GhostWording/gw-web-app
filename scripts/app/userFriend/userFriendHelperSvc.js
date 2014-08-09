angular.module('app/userFriend/userFriendHelperSvc', ['common/services/HelperSvc'])

.factory('userFriendHelperSvc', ['HelperSvc','filterHelperSvc','filteredTextsHelperSvc','facebookHelperSvc',
  function (HelperSvc,filterHelperSvc,filteredTextsHelperSvc,facebookHelperSvc) {

  var service = {

    makeUserFriendIdFromFbId: function (fbId) {
      return "facebook:" + fbId;
    },

    findUserFriendInList:  function (listName, ufriendList, fbId) {
      var valret = null;
      if (listName != 'birthdayList') {
        console.log('not implemented !!!!!!');
        return valret;
      }
      return ufriendList[service.makeUserFriendIdFromFbId(fbId)];
    },

    addFbFriendsToUserFriends : function(fbFriendList,uFriendList) {
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = service.makeUserFriendIdFromFbId(fbFriend.id);
        if ( !uFriendList[key] ) {
          uFriendList[key] = { 'userFriendId' : key, 'name' : fbFriend.name, 'gender' :  fbFriend.gender, 'birthday' : fbFriend.birthday, 'fbId' : fbFriend.id };
          //console.log(userBirthdayFriends[key]);
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
    setUFriendContextFilter : function (userFriend, contextName, availableContextsStyles,currentUser) {
      if ( !userFriend )
        return;
      userFriend.ufContext = contextName;
      var contextStyle = availableContextsStyles.stylesByName[userFriend.ufContext];
      filterHelperSvc.setContextTypeTag(userFriend.filters, contextStyle);
      service.updateUFriendFilteredTextList (userFriend,currentUser);
    },

    guessUFriendFamilialContextFilterFromFbFamilyList : function (userFriend, fbFamilyList, availableContextsStyles,currentUser) {
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
        userFriend.textList = textList;
        // Initialize filters
        userFriend.filters = filterHelperSvc.createEmptyFilters();
        // TODO : set filters from what we know
        // Set gender filter
        service.setUFriendGenderFilter(userFriend,currentUser);
        // Set context filter to family if friend is in family list
//        service.guessUFriendFamilialContextFilterFromFbFamilyList(userFriend,facebookSvc.getCurrentFamily(),availableContextsStyles,currentUser);
        service.guessUFriendFamilialContextFilterFromFbFamilyList(userFriend,fbFriendList,availableContextsStyles,currentUser);
        // Do filter and display
        service.updateUFriendFilteredTextList(userFriend,currentUser);
      }
    },

  };

  return service;
}]);

