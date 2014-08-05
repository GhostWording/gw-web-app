angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','currentUserLocalData','facebookSvc','currentLanguage','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc','subscribableRecipientsSvc','recipientsHelperSvc',
  function ($scope, ezfb,currentUserLocalData,facebookSvc,currentLanguage,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc,subscribableRecipientsSvc,recipientsHelperSvc) {

    $scope.fbLogin = facebookSvc.fbLogin;

    $scope.$watch(function() { return facebookSvc.isConnected();},function() {
      $scope.isConnected = facebookSvc.isConnected();
    },true);

//    $scope.$watch(function() { return facebookSvc.getCurrentMe();},function() {
//      console.log("facebookSvc.getCurrentMe() : " +facebookSvc.getCurrentMe());
//      $scope.apiMe = facebookSvc.getCurrentMe();
//    },true);
//
//    $scope.$watch(function() { return facebookSvc.getCurrentFamily();},function() {
//      console.log("facebookSvc.getCurrentFamily() : " +facebookSvc.getCurrentFamily().length );
//      $scope.apiFamily = facebookSvc.getCurrentFamily();
//    },true);

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

    // Set filters : recipient gender property
    $scope.setCurrentFriend = function(f) {
      $scope.currentFriend = f;
      if ( !!f.gender ) {
        if ( f.gender == 'female'  )
          $scope.filters.recipientGender = 'F';
        if ( f.gender == 'male'  )
          $scope.filters.recipientGender = 'H';
        $scope.filterMessageList();
      }
    };

    // Set filters : context  property
    $scope.contextStyles = contextStyles.createEmptyListForDashboard();
    $scope.setContextFilterToThis = function (style) {
      $scope.currentContextStyle = style;
      filterHelperSvc.setContextTypeTag($scope.filters,style);
      $scope.filterMessageList();
    };
    $scope.isCurrentContextStyle = function (style) {
      return  (style ==  $scope.currentContextStyle);
    };


    // Set filters : recipient property
    //$scope.recipientStyles = contextStyles.createEmptyListForDashboard();
    $scope.recipientTypeTag = null;
    subscribableRecipientsSvc.getAll().then(function(recipients) {
      $scope.recipients = recipientsHelperSvc.getCompatibleRecipients(recipients,currentUser);
    });
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