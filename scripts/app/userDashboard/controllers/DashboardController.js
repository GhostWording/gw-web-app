angular.module('app/userDashboard/DashboardController', [])
.controller('DashboardController', ['$scope', 'facebookSvc','HelperSvc','textsSvc','currentUser','contextStyles','filteredTextsHelperSvc','filterHelperSvc','DateHelperSvc','subscribableRecipientsSvc','recipientsHelperSvc','facebookHelperSvc','intentionsSvc','areasSvc','userFriendHelperSvc','currentUserFriendSvc','dashboardContextStyles',
  function ($scope, facebookSvc,HelperSvc,textsSvc,currentUser,contextStyles,filteredTextsHelperSvc,filterHelperSvc,DateHelperSvc,subscribableRecipientsSvc,recipientsHelperSvc,facebookHelperSvc,intentionsSvc,areasSvc,userFriendHelperSvc,currentUserFriendSvc,dashboardContextStyles) {
    // Date functions
//    $scope.fbBirthdayHasDayAndMonth = DateHelperSvc.fbBirthdayHasDayAndMonth;
//    $scope.fbBirthdayHasYear        = DateHelperSvc.fbBirthdayHasYear;
//    $scope.fbBirthdayToDisplay      = DateHelperSvc.fbBirthdayToDisplay;
//    $scope.fbAgeToDisplay           = DateHelperSvc.fbAgeToDisplay;
    $scope.displayDate              = DateHelperSvc.localDisplayDateWithMonth(new Date());
    // Login
    $scope.fbLogin = facebookSvc.fbLogin;
    // Display extra info during debug
    $scope.isDebug = true;

    // Sections can display one intention for several userFriends, or several intentions for one userFriend
    $scope.BoardSectionList =  [
      // For birthday there is a special way of getting relevant userFriends
      { 'sectionLabel' : 'Anniversaires', 'sectionType' : 'intention', 'sectionTargetId' : 'happy-birthday', 'visible' : true },
      { 'sectionLabel' : "Connais-tu l'histoire", 'sectionType' : 'intention', 'sectionTargetId' : 'humour', 'friends' : ['507096389','1228231171' ] },
      { 'sectionLabel' : 'Fake', 'sectionType' : 'fake', 'sectionTargetId' : 'fake'}  ];

    $scope.$watch(function() { return facebookSvc.isConnected();},function() {
      $scope.isConnected = facebookSvc.isConnected();
    },true);

//    Refresh facebook birthday friends when  facebook service changes them
//    $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday(); }, function(data) {
//      console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +data.length );
//      $scope.apiFriendsWithBirthday = data;
//
//      var birthdayFriend =  facebookSvc.getNextBirthdayFriends(facebookSvc.getCurrentFriends(),3);
//      $scope.apiNextBirthdayFriends = birthdayFriend;
//      userFriendHelperSvc.addFbFriendsToUserFriends(birthdayFriend,userBirthdayFriends);
//      prepareBirthdayTextLists();
//    },true);

    // Refresh user birthday friends when  facebook service changes them
    $scope.$watch(function() { return facebookSvc.getCurrentFriends(); }, function(res) {
      console.log("facebookSvc.getCurrentFriends() : " +res.length );
      $scope.allFbFriends =  res;
      $scope.allUserFriends = {};
      userFriendHelperSvc.addFbFriendsToUserFriends($scope.allFbFriends,$scope.allUserFriends);
      $scope.birthDayUserFriends = userFriendHelperSvc.getNextBirthdayFriends($scope.allUserFriends,3);
      //console.log($scope.birthDayUserFriends);
    },true);

    $scope.$watch(function() { return facebookSvc.getCurrentFamily(); }, function(res) {
      console.log("facebookSvc.getCurrentFamily() : " +res.length );
      userFriendHelperSvc.addFamilyMembersOrUpdateFamilialContext(res,$scope.allUserFriends);
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
