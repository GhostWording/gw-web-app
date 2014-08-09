angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'facebookSvc','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc','subscribableRecipientsSvc','recipientsHelperSvc','facebookHelperSvc','intentionsSvc','areasSvc','userFriendHelperSvc','currentUserFriendSvc',
  function ($scope, facebookSvc,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc,subscribableRecipientsSvc,recipientsHelperSvc,facebookHelperSvc,intentionsSvc,areasSvc,userFriendHelperSvc,currentUserFriendSvc) {
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

    // To store information provided by user on his friends / recipients
    var userBirthdayFriends = {};

    // Available context styles
    $scope.contextStyles = contextStyles.createEmptyListForDashboard();

    $scope.isCurrentContextStyle = function (style) {
      return style.name == currentUserFriendSvc.getCurrentUserFriendContext();
    };

    // Initilize text list for each birthday friend
    function prepareBirthdayTextLists() {
      // Get promise from cache or server
      textsSvc.getListForCurrentArea("happy-birthday").then(function (textList) {
        userFriendHelperSvc.initializeTextListForUserFriends(userBirthdayFriends,textList,contextStyles.createEmptyListForDashboard(),facebookSvc.getCurrentFamily(),currentUser);
        updateUFriendListDisplay(userBirthdayFriends);
          // Check server for newer version in case cache is stale
          // intentionsSvc.invalidateCacheIfNewerServerVersionExists(areasSvc.getCurrentName(),"happy-birthday")
          // Then you may want to update current display (or leave it as it si : cache will be good next time)
         //  .then(function(shouldReload){  if (shouldReload)  // refresh texts     });

      });
    }

    var displayScopeUFriendInfo = function(userFriend) {
      if (! userFriend )
        return;
      var valret ="";
      valret += userFriend.filteredTextList.length;
      $scope.userFriendInfo[userFriend.fbId] = valret;
      $scope.randomBirthdayTextList[userFriend.fbId] = userFriend.filteredTextList[0].Content;
      return valret;
    };

    var updateUFriendListDisplay = function (userFriendList) {
      for (var key in userFriendList)
        displayScopeUFriendInfo(userFriendList[key]);
    };

    // Set filters for recipient gender property
    $scope.setCurrentFriend = function(listName,f) {
      var uf = userFriendHelperSvc.findUserFriendInList (listName,userBirthdayFriends, f.id);
      currentUserFriendSvc.setCurrentUserFriend(uf);
    };

    // Set filters for context  property
    $scope.setContextFilterToThis = function (contextStyle) {
      userFriendHelperSvc.setUFriendContextFilter (currentUserFriendSvc.getCurrentUserFriend(),contextStyle.name,$scope.contextStyles,currentUser);
    };

    // Get likely recipient types using know information
    var updatePossibleRecipients = function(contextName,UFriend) { // TODO : userFriends should have possibleRecipients too !!!!!!!!!!!!!
      subscribableRecipientsSvc.getAll().then(function(recipients) {
        $scope.recipients = recipientsHelperSvc.getCompatibleRecipients(recipients,currentUser,UFriend,facebookSvc.getCurrentMe(),contextName);
      });
    };

    $scope.setRecipientTypeToThis = function (recipientType) {
      userFriendHelperSvc.setUFriendRecipientTypeFilter (currentUserFriendSvc.getCurrentUserFriend(),recipientType.RecipientTypeId,currentUser);
    };

    $scope.$watch(function() { return currentUserFriendSvc.getCurrentUserFriend();}, function(userFriend) {
      displayScopeUFriendInfo(userFriend);
    },true);

    // TODO : should be donne in a userFriend svc
    $scope.$watch(function() { return currentUserFriendSvc.getCurrentUserFriendContext();}, function(contextName) {
      updatePossibleRecipients(contextName,currentUserFriendSvc.getCurrentUserFriend());
    },true);

    $scope.$watch(function() { return facebookSvc.isConnected();},function() {
      $scope.isConnected = facebookSvc.isConnected();
    },true);
    // Refresh birthday friends when they facebook service changes them
    $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday(); }, function() {
      console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +facebookSvc.getSortedFriendsWithBirthday().length );
      $scope.apiFriendsWithBirthday = facebookSvc.getSortedFriendsWithBirthday();
      $scope.apiNextBirthdayFriends =  facebookSvc.getNextBirthdayFriend(3);
      userFriendHelperSvc.addFbFriendsToUserFriends($scope.apiNextBirthdayFriends,userBirthdayFriends);
      prepareBirthdayTextLists();
    },true);

  }]);


// Il ne marche pas: un autre svp vs   // OK, envoyer
// Not appropriate / doesnt work : get a better one vs  // Ok, send it


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
