angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','currentUserLocalData','facebookSvc','currentLanguage','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc','subscribableRecipientsSvc','recipientsHelperSvc','facebookHelperSvc','intentionsSvc','areasSvc',
  function ($scope, ezfb,currentUserLocalData,facebookSvc,currentLanguage,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc,subscribableRecipientsSvc,recipientsHelperSvc,facebookHelperSvc,intentionsSvc,areasSvc) {
    // Date functions
    $scope.fbBirthdayHasDayAndMonth = DateHelperSvc.fbBirthdayHasDayAndMonth;
    $scope.fbBirthdayHasYear        = DateHelperSvc.fbBirthdayHasYear;
    $scope.fbBirthdayToDisplay      = DateHelperSvc.fbBirthdayToDisplay;
    $scope.fbAgeToDisplay           = DateHelperSvc.fbAgeToDisplay;
    $scope.displayDate              = DateHelperSvc.localDisplayDateWithMonth(new Date());
    // Login
    $scope.fbLogin = facebookSvc.fbLogin;

    // Display extra info during debug
    $scope.isDebug = true;

    // Binds to randomBirthdayTextList[fbId] in view
    $scope.randomBirthdayTextList = {};
    // Binds to userFriendInfo[fbId] in view : for debug
    $scope.userFriendInfo = {};
    // Track friend that we act on with global buttons
    $scope.currentBirthdayFriend = null;
    // Filtered birthday message list
    $scope.filteredList = [];
    // Available context styles
    $scope.contextStyles = contextStyles.createEmptyListForDashboard();

    // Initilize text list for each birthday friend
    function prepareBirthdayTextLists() {
      // Get promise from cache or server
      textsSvc.getListForCurrentArea("happy-birthday").then(function (textList) {
        initializeTextListForUserFriends(userBirthdayFriends,textList);
        // For old stuff
        $scope.debugTextList = textList;
          // Check server for newer version in case cache is stale
          // intentionsSvc.invalidateCacheIfNewerServerVersionExists(areasSvc.getCurrentName(),"happy-birthday")
          // Then you may want to update current display (or leave it as it si : cache will be good next time)
         //  .then(function(shouldReload){  if (shouldReload)  // refresh texts     });

      });
    }

    // Il ne marche pas: un autre svp vs   // OK, envoyer
    // Not appropriate / doesnt work : get a better one vs  // Ok, send it

    var findUserFriendInList = function (listName, fbId) {
      var valret = null;
      if (listName != 'birthdayList') {
        console.log('not implemented !!!!!!');
        return valret;
      }
      return userBirthdayFriends[makeUserFriendIdFromFbId(fbId)];
    };

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

    var displayScopeUFriendInfo = function(userFriend) {
      var valret ="";
      valret += userFriend.filteredTextList.length;
      $scope.userFriendInfo[userFriend.fbId] = valret;
      $scope.filteredMessageList = userFriend.filteredTextList;
      $scope.randomBirthdayTextList[userFriend.fbId] = userFriend.filteredTextList[0].Content;
      return valret;
    };

    var updateUFriendTextList = function(userFriend) {
      userFriend.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(userFriend.textList, currentUser, userFriend.filters.preferredStyles, userFriend.filters);
    };
    var setUFRecipientTypeFilter = function (userFriend, recipientTypeTag) {
      filterHelperSvc.setRecipientTypeTag(userFriend.filters, recipientTypeTag);
    };
    var setUserFriendGenderFilter = function (userFriend) {
      if (!!userFriend.gender) {
        userFriend.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(userFriend.gender);
      }
    };
    var setUFriendContextFilter = function (userFriend, contextName, availableContextsStyles) {
      userFriend.ufContext = contextName;
      var contextStyle = availableContextsStyles.stylesByName[userFriend.ufContext];
      filterHelperSvc.setContextTypeTag(userFriend.filters, contextStyle);
    };
    var setUserFriendContextFilterFromFbFamilyList = function (userFriend,fbFamily,availableContextsStyles) {
      if ( !!fbFamily  ) {
        if (facebookHelperSvc.friendListContainsFriend(fbFamily, userFriend.fbId) ) {
          console.log(userFriend.name + " is family");
          setUFriendContextFilter (userFriend,"familialContext",availableContextsStyles);
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
        updateUFriendTextList(userFriend);
        displayScopeUFriendInfo(userFriend);
      }
    };

    // Set filters for recipient gender property
    $scope.setCurrentFriend = function(listName,f) {
      // new stuff
      var userFriend = findUserFriendInList (listName, f.id);
      $scope.currentBirthdayFriend = userFriend;
      $scope.currentContextName = userFriend.ufContext;
      $scope.filteredList = userFriend.filteredTextList;
      displayScopeUFriendInfo(userFriend);
      updatePossibleRecipients($scope.currentContextName);
    };

    // Set filters for context  property
    $scope.setContextFilterToThis = function (contextStyle) {
      $scope.currentContextName = contextStyle.name;
      updatePossibleRecipients($scope.currentContextName);
      // New stuff
      setUFriendContextFilter ($scope.currentBirthdayFriend,contextStyle.name,$scope.contextStyles);
      updateUFriendTextList ($scope.currentBirthdayFriend);
      displayScopeUFriendInfo($scope.currentBirthdayFriend);
    };

    $scope.isCurrentContextStyle = function (style) {
      return  (style.name ==  $scope.currentContextName);
    };

    // Get likely recipient types using know information
    var updatePossibleRecipients = function(contextName) { // TODO : userFriends should have possibleRecipients too !!!!!!!!!!!!!
      subscribableRecipientsSvc.getAll().then(function(recipients) {
        $scope.recipients = recipientsHelperSvc.getCompatibleRecipients(recipients,currentUser,$scope.currentFriend,facebookSvc.getCurrentMe(),contextName);
      });
    };
    updatePossibleRecipients($scope.currentContextName);

    $scope.setRecipientTypeToThis = function (recipientType) {
      // New stuff
      setUFRecipientTypeFilter ($scope.currentBirthdayFriend,recipientType.RecipientTypeId);
      updateUFriendTextList ($scope.currentBirthdayFriend);
      displayScopeUFriendInfo($scope.currentBirthdayFriend);
    };

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

  }]);

//$scope.randomText = {};
//$scope.getRandomTextFromList = function() {
//  var shuffledList = HelperSvc.shuffleTextIfSortOrderNotLessThan($scope.filteredMessageList,-1);
//  $scope.txtContent = '';
//  if ( shuffledList.length > 0  ) {
//    $scope.txtContent = angular.copy(shuffledList[0]).Content;
//  }
//  //console.log($scope.txtContent);
//  return $scope.txtContent;
//};


//var getRandomTextFromThisList = function(textList) {
//  // TODO : should not do that, should generate random index !!
//  var shuffledList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList,-1);
//  var valret = '';
//  if ( shuffledList.length > 0  ) {
//    //valret = angular.copy(shuffledList[0]).Content;
//    valret = shuffledList[0];
//  }
//  return valret;
//};


// Update birthday message filtering
//$scope.filterMessageList = function () {
//  // Avoid calling twice when view initializes
//  $scope.filteredMessageList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.textList, currentUser, $scope.filters.preferredStyles,$scope.filters);
//  if ( !! $scope.apiNextBirthdayFriends ) {
//    for (var i = 0; i < $scope.apiNextBirthdayFriends.length; i++ ) {
//      var id = $scope.apiNextBirthdayFriends[i].id;
//      var txt = getRandomTextFromThisList($scope.filteredMessageList);
//      var content = HelperSvc.isQuote(txt) ? HelperSvc.insertAuthorInText(txt.Content, txt.Author) : txt.Content ;
//    }
//  }
//};


//    var filterUserFriendMessageList = function (userFriend) {
//      userFriend.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(userFriend.textList, currentUser, userFriend.filters.preferredStyles, userFriend.filters);
//      var txt = getRandomTextFromThisList($scope.filteredMessageList);
//      var content = HelperSvc.isQuote(txt) ? HelperSvc.insertAuthorInText(txt.Content, txt.Author) : txt.Content;
//      $scope.randomTextList[id] = content;
//    };
