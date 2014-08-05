angular.module('app/users/DashboardController', [])
.controller('DashboardController', ['$scope', 'ezfb','currentUserLocalData','facebookSvc','currentLanguage','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc',
  function ($scope, ezfb,currentUserLocalData,facebookSvc,currentLanguage,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc) {

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

//    $scope.filters = filtersSvc.filters;
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


    var enMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var frMonths = ['jan','fev','mars','avr.','mai','juin','juil','aout','sept','oct','nov','dec'];

    var enDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var frDays = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

    // Use    d.toLocaleDateString() if you don't want to bother !!!!!!
    var displayDate = function (d) {
      var months = enMonths;
      var days = enDays;

      var language = currentLanguage.getLanguageCode();
      if (language == 'fr') {
        months = frMonths;
        days = frDays;
      }

      // TODO // if fb user locale == "en_US", change date format
      var retval = days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
      return retval;
    };

    $scope.fbBirthdayHasDayAndMonth = function(d) {
      return HelperSvc.fbBirthdayDay(d) > -1 && HelperSvc.fbBirthdayMonth(d) > -1;
    };
    $scope.fbBirthdayHasYear = function(d) {
      return HelperSvc.fbBirthdayAge(d) > -1;
    };

    $scope.fbBirthdayToDisplay = function (d) {
      var monthNames = enMonths;

      var language = currentLanguage.getLanguageCode();
      if (language == 'fr') { monthNames = frMonths; }

      var day = HelperSvc.fbBirthdayDay(d);
      var month = HelperSvc.fbBirthdayMonth(d);

      var valret = "";
      if ( day > -1 && month > -1) {
        valret += day + ' '  + monthNames[month-1];
      }
      return valret;
    };

    $scope.fbAgeToDisplay = function (d) {
      var valret = "";
      var age = HelperSvc.fbBirthdayAge(d);
      if ( age > -1 ) {
        valret += age;
      }
    return valret;
    };

    $scope.displayDate = displayDate(new Date());

    //console.log( new Date().toLocaleDateString());
  }]);