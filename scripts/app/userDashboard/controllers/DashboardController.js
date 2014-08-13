angular.module('app/userDashboard/DashboardController', [])
.controller('DashboardController', ['$scope', 'facebookSvc','DateHelperSvc','userFriendHelperSvc','userFriendsSvc',
  function ($scope, facebookSvc,DateHelperSvc,userFriendHelperSvc,userFriendsSvc) {
    // Date functions
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

    // Refresh user friends and birthday user friends when  facebook friend list arrives
    $scope.$watch(function() { return facebookSvc.getCurrentFriends(); }, function(res) {
      console.log("facebookSvc.getCurrentFriends() : " +res.length );
      userFriendsSvc.setUFList(userFriendHelperSvc.createUFListFromFbFriends(res));
      userFriendsSvc.setBirthdayUFList(userFriendHelperSvc.getNextBirthdayFriends(userFriendsSvc.getUFList(),3));
    },true);

    // Refresh familly user friends when facebook family list arrives
    $scope.$watch(function() { return facebookSvc.getCurrentFamily(); }, function(res) {
      console.log("facebookSvc.getCurrentFamily() : " +res.length );
      userFriendHelperSvc.addFamilyMembersOrUpdateFamilialContext(res,userFriendsSvc.getUFList());
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
