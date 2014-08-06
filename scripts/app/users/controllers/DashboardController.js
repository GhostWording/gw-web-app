angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','currentUserLocalData','facebookSvc','currentLanguage','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc','subscribableRecipientsSvc','recipientsHelperSvc',
  function ($scope, ezfb,currentUserLocalData,facebookSvc,currentLanguage,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc,subscribableRecipientsSvc,recipientsHelperSvc) {

    $scope.fbLogin = facebookSvc.fbLogin;

    $scope.$watch(function() { return facebookSvc.isConnected();},function() {
      $scope.isConnected = facebookSvc.isConnected();
    },true);

    // Refresh birthday friends when they facebook service changes them
    $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday();},function() {
      console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +facebookSvc.getSortedFriendsWithBirthday().length );
      $scope.apiFriendsWithBirthday = facebookSvc.getSortedFriendsWithBirthday();
      $scope.apiNextBirthdayFriends =  facebookSvc.getNextBirthdayFriend();
    },true);

    // Birthday message list
    $scope.filteredList = [];
    // Update birthday message filtering
    $scope.filterMessageList = function () {
      // Avoid calling twice when view initializes
      $scope.filteredMessageList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.textList, currentUser, $scope.filters.preferredStyles,$scope.filters);
    };
    // Initilize full text list and filtered text list
    function prepareBirthdayTextList() {
      textsSvc.getListForCurrentArea("happy-birthday").then(function (textList) {
        $scope.textList = textList;
        $scope.filterMessageList();
      });
    }
    prepareBirthdayTextList();

    // TODO : filters will be durable properties of recipients
    $scope.filters = filterHelperSvc.createEmptyFilters();

    // Set filters for recipient gender property
    $scope.setCurrentFriend = function(f) {
      $scope.currentFriend = f;
      updatePossibleRecipients();

      var isFamily = false;
      var fbFamily = facebookSvc.getCurrentFamily();
      if (facebookSvc.friendListContainsFriend(fbFamily, f.id) ) {
        console.log(f.name + " is family");
        $scope.currentContextName = "familialContext";
      } else
        $scope.currentContextName = "";



      if ( !!f.gender ) {
        if ( f.gender == 'female'  )
          $scope.filters.recipientGender = 'F';
        if ( f.gender == 'male'  )
          $scope.filters.recipientGender = 'H';
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


//    if ( currentRecipient ) {
//      filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeId); // Shoud not be reinitialized when we come back from TextDetail view
//    }

    // Map date functions
    $scope.fbBirthdayHasDayAndMonth = DateHelperSvc.fbBirthdayHasDayAndMonth;
    $scope.fbBirthdayHasYear        = DateHelperSvc.fbBirthdayHasYear;
    $scope.fbBirthdayToDisplay      = DateHelperSvc.fbBirthdayToDisplay;
    $scope.fbAgeToDisplay           = DateHelperSvc.fbAgeToDisplay;
    $scope.displayDate              = DateHelperSvc.localDisplayDateWithMonth(new Date());
  }]);