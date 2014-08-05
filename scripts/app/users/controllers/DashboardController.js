angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','currentUserLocalData','facebookSvc','currentLanguage','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc',
  function ($scope, ezfb,currentUserLocalData,facebookSvc,currentLanguage,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc) {

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

    $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday();},function() {
      console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +facebookSvc.getSortedFriendsWithBirthday().length );
      $scope.apiFriendsWithBirthday = facebookSvc.getSortedFriendsWithBirthday();
      $scope.apiNextBirthdayFriends =  facebookSvc.getNextBirthdayFriend();
    },true);

    $scope.filteredList = [];
    $scope.filters = filterHelperSvc.createEmptyFilters();
    $scope.setCurrentFriend = function(f) {
      $scope.currentFriend = f;
      if ( !!f.gender ) {
        if ( f.gender == 'female'  )
          $scope.filters.recipientGender = 'F';
        if ( f.gender == 'male'  )
          $scope.filters.recipientGender = 'H';
        $scope.filterList();
      }
    };

    $scope.filterList = function () {
      // TODO : This should not be called two times when view initializes
//      $scope.filteredList = filteredTextListSvc.setFilteredAndOrderedList($scope.textList, currentUser, filtersSvc.filters.preferredStyles);
      $scope.filteredList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.textList, currentUser, $scope.filters.preferredStyles,$scope.filters);
    };

    $scope.contextStyles = contextStyles.createEmptyListForDashboard();
    $scope.setContextFilterToThis = function (style) {
    };


    function prepareBirthdayTextList() {
      textsSvc.getListForCurrentArea("happy-birthday").then(function(textList) {
        $scope.textList =textList;
        //textsSvc.countTextsForStylesAndProperties(textList);
        $scope.filterList();
         });
    }
    prepareBirthdayTextList();

//    if ( currentRecipient ) {
//      filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeId); // Shoud not be reinitialized when we come back from TextDetail view
//    }
    $scope.fbBirthdayHasDayAndMonth = DateHelperSvc.fbBirthdayHasDayAndMonth;
    $scope.fbBirthdayHasYear = DateHelperSvc.fbBirthdayHasYear;

    $scope.fbBirthdayToDisplay = DateHelperSvc.fbBirthdayToDisplay;
    $scope.fbAgeToDisplay = DateHelperSvc.fbAgeToDisplay;
    $scope.displayDate = DateHelperSvc.localDisplayDateWithMonth(new Date());
  }]);