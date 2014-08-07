angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','currentUserLocalData','facebookSvc','currentLanguage','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc','subscribableRecipientsSvc','recipientsHelperSvc','facebookHelperSvc','intentionsSvc','areasSvc',
  function ($scope, ezfb,currentUserLocalData,facebookSvc,currentLanguage,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc,subscribableRecipientsSvc,recipientsHelperSvc,facebookHelperSvc,intentionsSvc,areasSvc) {

    $scope.fbLogin = facebookSvc.fbLogin;

    $scope.isDebug = true;
    $scope.currentBirthdayFriend = null;

    $scope.$watch(function() { return facebookSvc.isConnected();},function() {
      $scope.isConnected = facebookSvc.isConnected();
    },true);

    // Refresh birthday friends when they facebook service changes them
    $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday(); }, function() {
      console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +facebookSvc.getSortedFriendsWithBirthday().length );
      $scope.apiFriendsWithBirthday = facebookSvc.getSortedFriendsWithBirthday();
      $scope.apiNextBirthdayFriends =  facebookSvc.getNextBirthdayFriend();

      addFbFriendsToUserBirthdayFriends($scope.apiNextBirthdayFriends);

      prepareBirthdayTextLists();
    },true);


    // Initilize text list for each birthday friend
    function prepareBirthdayTextLists() {
      // Get promise from cache or server
      textsSvc.getListForCurrentArea("happy-birthday").then(function (textList) {
        // Set this for every users in birthdayUserFriends
        $scope.textList = textList;
        $scope.filterMessageList();

        initializeTextListForUserFriends(userBirthdayFriends,textList);

          // Check server for newer version then if courageous update current display, or leave it until next time
//        intentionsSvc.invalidateCacheIfNewerServerVersionExists(areasSvc.getCurrentName(),"happy-birthday")
//        .then(function(shouldReload){
//          if (shouldReload)
//            // refresh texts
//        });

      });
    }
    //prepareBirthdayTextList();

    $scope.randomBirthdayTextList = {};


    var getRandomTextFromThisList = function(textList) {
      // TODO : should not do that, should generate random index !!
      var shuffledList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList,-1);
      var valret = '';
      if ( shuffledList.length > 0  ) {
        //valret = angular.copy(shuffledList[0]).Content;
        valret = shuffledList[0];
      }
      return valret;
    };


    // Il ne marche pas: un autre svp
    // OK, envoyer

    // Not appropriate / doesnt work : get a better one
    // Ok, send it

    // Birthday message list
    $scope.filteredList = [];
    // Update birthday message filtering
    $scope.filterMessageList = function () {
      // Avoid calling twice when view initializes
      $scope.filteredMessageList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.textList, currentUser, $scope.filters.preferredStyles,$scope.filters);
      if ( !! $scope.apiNextBirthdayFriends ) {
        for (var i = 0; i < $scope.apiNextBirthdayFriends.length; i++ ) {
          var id = $scope.apiNextBirthdayFriends[i].id;
          var txt = getRandomTextFromThisList($scope.filteredMessageList);
          var content = HelperSvc.isQuote(txt) ? HelperSvc.insertAuthorInText(txt.Content, txt.Author) : txt.Content ;
        }
      }
    };

    var filterUserFriendMessageList = function (userFriend) {
      userFriend.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(userFriend.textList, currentUser, userFriend.filters.preferredStyles, userFriend.filters);
      var txt = getRandomTextFromThisList($scope.filteredMessageList);
      var content = HelperSvc.isQuote(txt) ? HelperSvc.insertAuthorInText(txt.Content, txt.Author) : txt.Content;
      //$scope.randomTextList[id] = content;
    };


    var findUserFriendInList = function (listName, fbId) {
      var valret = null;
      if (listName != 'birthdayList') {
        console.log('not implemented !!!!!!');
        return valret;
      }
      return userBirthdayFriends[makeUserFriendIdFromFbId(fbId)];
    };

//    $scope.randomBirthdayTextList = function(listName,fbId) {
//      var userFriend = findUserFriendInList(listName,fbId);
//      userFriend.currentText = userFriend.textList[0];
//      valret = userFriend.currentText;
//      $scope[fbId] = valret;
//      //return valret;
//      return $scope[fbId];
//    };

    var makeUserFriendIdFromFbId = function (fbId) {
      return "facebook:" + fbId;
    };

    // To store information provided by user on his friends / recipients
    var userBirthdayFriends = {};

    var addFbFriendsToUserBirthdayFriends = function(fbFriendList) {
      for (var i= 0; i < fbFriendList.length; i++ ) {
        var fbFriend = fbFriendList[i];
        var key = makeUserFriendIdFromFbId(fbFriend.id);
        if ( !userBirthdayFriends[key] ) {
          userBirthdayFriends[key] = { 'userFriendId' : key, 'name' : fbFriend.name, 'gender' :  fbFriend.gender, 'birthday' : fbFriend.birthday, 'fbId' : fbFriend.id };
          //console.log(userBirthdayFriends[key]);
        }
      }
    };

    $scope.userFriendInfo = {};
    var setUserFriendInfo = function(userFriend) {
      //var userFriend = findUserFriendInList("birthdayList",fbFriend.id);
      var valret ="";
      valret += userFriend.filteredTextList.length;
      $scope.userFriendInfo[userFriend.fbId] = valret;
      return valret;
    };

    var filterUserTextListAndDisplayInfo = function(userFriend) {
//      userFriend.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(textList, currentUser, userFriend.filters.preferredStyles, userFriend.filters);
      userFriend.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(userFriend.textList, currentUser, userFriend.filters.preferredStyles, userFriend.filters);
      $scope.randomBirthdayTextList[userFriend.fbId] = userFriend.filteredTextList[0].Content;
      setUserFriendInfo(userFriend);
    };

    var setUserFriendGenderFilter = function (userFriend) {
      if ( !!userFriend.gender ) {
        userFriend.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(userFriend.gender);
      }
    };

    var setUFContextFilterFromName = function (userFriend,contextName,availableContextsStyles) {
      userFriend.ufContext = contextName;
      var contextStyle = availableContextsStyles.stylesByName[userFriend.ufContext];
      filterHelperSvc.setContextTypeTag(userFriend.filters,contextStyle);
    };
    var setUFRecipientTypeFilter = function (userFriend,recipientTypeTag) {
    filterHelperSvc.setRecipientTypeTag(userFriend.filters,recipientTypeTag);
    };


    var setUserFriendContextFilterFromFbFamilyList = function (userFriend,fbFamily,availableContextsStyles) {
      if ( !!fbFamily  ) {
        if (facebookHelperSvc.friendListContainsFriend(fbFamily, userFriend.fbId) ) {
          console.log(userFriend.name + " is family");
          setUFContextFilterFromName (userFriend,"familialContext",availableContextsStyles);
        }
      }
    };

    var initializeTextListForUserFriends = function (userBirthdayFriends, textList) {

      for (var key in userBirthdayFriends) {
        var userFriend = userBirthdayFriends[key];
        // Initialize text list
        userFriend.textList = textList;
        // Initialize filters
        userFriend.filters = filterHelperSvc.createEmptyFilters();
        // TODO : set filters from what we know
        // Set gender filter
        setUserFriendGenderFilter(userFriend);
        // Set context filter to family if friend is in family list
        setUserFriendContextFilterFromFbFamilyList(userFriend,facebookSvc.getCurrentFamily(),contextStyles.createEmptyListForDashboard());
        // Do filter and display
        filterUserTextListAndDisplayInfo(userFriend);
      }
    };

    // TODO : filters will be durable properties of recipients
    $scope.filters = filterHelperSvc.createEmptyFilters();

    // Set filters for recipient gender property
    $scope.setCurrentFriend = function(listName,f) {

      // old stuff
      $scope.currentFriend = f;
      updatePossibleRecipients();

      var isFamily = false;
      var fbFamily = facebookSvc.getCurrentFamily();
      if (facebookHelperSvc.friendListContainsFriend(fbFamily, f.id) ) {
        console.log(f.name + " is family");
        $scope.currentContextName = "familialContext";
      } else
        $scope.currentContextName = null;

      if ( !!f.gender ) {
        $scope.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(f.gender);
        $scope.filterMessageList();
      }

      // new stuff
      var userFriend = findUserFriendInList (listName, f.id);
      $scope.currentBirthdayFriend = userFriend;
      $scope.currentContextName = userFriend.ufContext;
      var contextStyle = $scope.contextStyles.stylesByName[userFriend.ufContext];
      filterHelperSvc.setContextTypeTag($scope.filters,contextStyle);
      $scope.filterMessageList();
    };

    // Set filters for context  property
    $scope.contextStyles = contextStyles.createEmptyListForDashboard();
    $scope.setContextFilterToThis = function (contextStyle) {
      $scope.currentContextName = contextStyle.name;
      filterHelperSvc.setContextTypeTag($scope.filters,contextStyle);
      $scope.filterMessageList();
      updatePossibleRecipients();

      // New stuff
      setUFContextFilterFromName ($scope.currentBirthdayFriend,contextStyle.name,$scope.contextStyles);
      filterUserTextListAndDisplayInfo ($scope.currentBirthdayFriend);
      };

    $scope.isCurrentContextStyle = function (style) {
      return  (style.name ==  $scope.currentContextName);
    };

    // Get likely recipient types using know information
    $scope.recipientTypeTag = null;
    var updatePossibleRecipients = function() { // TODO : userFriends should have possibleRecipients too !!!!!!!!!!!!!
      subscribableRecipientsSvc.getAll().then(function(recipients) {
        $scope.recipients = recipientsHelperSvc.getCompatibleRecipients(recipients,currentUser,$scope.currentFriend,facebookSvc.getCurrentMe(),$scope.currentContextName);
      });
    };
    updatePossibleRecipients();
    $scope.setRecipientTypeToThis = function (recipientType) {
      $scope.recipientTypeTag = recipientType.RecipientTypeId;
      filterHelperSvc.setRecipientTypeTag($scope.filters,$scope.recipientTypeTag);
      $scope.filterMessageList();

      // New stuff
      setUFRecipientTypeFilter ($scope.currentBirthdayFriend,$scope.recipientTypeTag);
      filterUserTextListAndDisplayInfo ($scope.currentBirthdayFriend);

    };

    // Crap below

    $scope.randomText = {};

    $scope.getRandomTextFromList = function() {
      var shuffledList = HelperSvc.shuffleTextIfSortOrderNotLessThan($scope.filteredMessageList,-1);
      $scope.txtContent = '';
      if ( shuffledList.length > 0  ) {
        $scope.txtContent = angular.copy(shuffledList[0]).Content;
      }
      //console.log($scope.txtContent);
      return $scope.txtContent;
    };

    var getRandomTextFromList = function(textList) {
      var shuffledList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList,-1);
      var valret = '';
      if ( shuffledList.length > 0  ) {
        valret = angular.copy(shuffledList[0]).Content;
      }
      return valret;
    };

    // Map date functions
    $scope.fbBirthdayHasDayAndMonth = DateHelperSvc.fbBirthdayHasDayAndMonth;
    $scope.fbBirthdayHasYear        = DateHelperSvc.fbBirthdayHasYear;
    $scope.fbBirthdayToDisplay      = DateHelperSvc.fbBirthdayToDisplay;
    $scope.fbAgeToDisplay           = DateHelperSvc.fbAgeToDisplay;
    $scope.displayDate              = DateHelperSvc.localDisplayDateWithMonth(new Date());
  }]);