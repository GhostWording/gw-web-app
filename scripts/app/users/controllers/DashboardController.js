angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','currentUserLocalData','facebookSvc','currentLanguage','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc','subscribableRecipientsSvc','recipientsHelperSvc','facebookHelperSvc','intentionsSvc','areasSvc',
  function ($scope, ezfb,currentUserLocalData,facebookSvc,currentLanguage,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc,subscribableRecipientsSvc,recipientsHelperSvc,facebookHelperSvc,intentionsSvc,areasSvc) {

    $scope.fbLogin = facebookSvc.fbLogin;

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
          //$scope.randomTextList[id] = content;
        }
      }
    };

    $scope.randomBirthdayTextList = function(listName,fbId) {
      var valret = null;
      if (listName != 'birthdayList') {
        console.log('not implemented !!!!!!');
        return valret;
      }
      var userFriend = userBirthdayFriends[makeUserFriendIdFromFbId(fbId)];
      userFriend.currentText = userFriend.textList[0];
      valret = userFriend.currentText;
      $scope[fbId] = valret;
      //return valret;
      return $scope[fbId];
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
          userBirthdayFriends[key] = { 'userFriendId' : key, 'userName' : fbFriend.name, 'gender' :  fbFriend.gender, 'birthday' : fbFriend.birthday, 'fbId' : fbFriend.id };
          //console.log(userBirthdayFriends[key]);
        }
      }
    };

    var initializeTextListForUserFriends = function (userBirthdayFriends, textList) {
      for (var key in userBirthdayFriends) {
        var userFriend = userBirthdayFriends[key];
        userFriend.textList = textList;
        userFriend.filters = filterHelperSvc.createEmptyFilters();
        // TODO : set filters from what we know
        userFriend.textfilteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(textList, currentUser, userFriend.filters.preferredStyles, userFriend.filters);
        $scope.randomBirthdayTextList[userFriend.fbId] = userFriend.textfilteredTextList[0].Content;
      }
    };

    // TODO : filters will be durable properties of recipients
    $scope.filters = filterHelperSvc.createEmptyFilters();

    // Set filters for recipient gender property
    $scope.setCurrentFriend = function(f) {
      $scope.currentFriend = f;
      updatePossibleRecipients();

      var isFamily = false;
      var fbFamily = facebookSvc.getCurrentFamily();

      if (facebookHelperSvc.friendListContainsFriend(fbFamily, f.id) ) {
        console.log(f.name + " is family");
        $scope.currentContextName = "familialContext";
      } else
        $scope.currentContextName = "";


      if ( !!f.gender ) {
        $scope.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(f.gender);
        $scope.filterMessageList();
      }
    };


    // Set filters for context  property
    $scope.contextStyles = contextStyles.createEmptyListForDashboard();
    $scope.setContextFilterToThis = function (contextStyle) {
      $scope.currentContextName = contextStyle.name;
      filterHelperSvc.setContextTypeTag($scope.filters,contextStyle);
      $scope.filterMessageList();
      updatePossibleRecipients();
    };
    $scope.isCurrentContextStyle = function (style) {
      return  (style.name ==  $scope.currentContextName);
    };

    // Get likely recipient types using know information
    $scope.recipientTypeTag = null;
    var updatePossibleRecipients = function() {
      subscribableRecipientsSvc.getAll().then(function(recipients) {
        $scope.recipients = recipientsHelperSvc.getCompatibleRecipients(recipients,currentUser,$scope.currentFriend,facebookSvc.getCurrentMe(),$scope.currentContextName);
      });
    };
    updatePossibleRecipients();


    $scope.setRecipientTypeToThis = function (recipientType) {
      $scope.recipientTypeTag = recipientType.RecipientTypeId;
      filterHelperSvc.setRecipientTypeTag($scope.filters,$scope.recipientTypeTag);
      $scope.filterMessageList();
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