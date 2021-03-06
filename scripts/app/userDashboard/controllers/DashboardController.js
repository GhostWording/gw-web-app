angular.module('app/userDashboard/DashboardController', [])
.controller('DashboardController', ['$scope', 'facebookSvc','dateHelperSvc','ufHelperSvc','ufSvc','appUrlSvc','currentAreaName','textsSvc','postActionSvc','$stateChange',
  function ($scope, facebookSvc,dateHelperSvc,ufHelperSvc,ufSvc,appUrlSvc,currentAreaName,textsSvc,postActionSvc,$stateChange) {
    $scope.appUrlSvc = appUrlSvc;
    $scope.currentAreaName = currentAreaName;
    $scope.getCurrentTextId = function() {
      //console.log(currentTextId+ " " + nextTextId);
      var nextTextId = $stateChange.toParams.textId;
      return nextTextId;
    };
    // We want to track this page is loaded, event when no action occurs on its content
    postActionSvc.postActionInfo('Init','Page','Dashboard','Init');
    // Login
    $scope.fbLogin = facebookSvc.fbLogin;
    // Display extra info during debug
    $scope.isDebug = false;
    // Todays date
    $scope.displayDate = dateHelperSvc.localDisplayDateWithMonth(new Date());

    var nbBirtdayFriends = 6;

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
    $scope.$watch(function() { return facebookSvc.getCurrentFriends(); }, function(fbFriends) {
      if ( !fbFriends ) return;
      //console.log("facebookSvc.getCurrentFriends() ::: " +res.length );
      // We should not create the list, only augment it, for it might have been initialized elsewhere, like for familly or frequent correspondents
      //ufSvc.setUserFriends(ufHelperSvc.createUFListFromFbFriends(res));
      var currentUserFriends = ufSvc.getUFList();
      ufHelperSvc.addFbFriendsToUserFriendsIfAbsent(fbFriends,currentUserFriends);
      var birthdayUF = ufHelperSvc.getNextBirthdayUserFriends( ufSvc.getUFList(),nbBirtdayFriends );
      ufSvc.setBirthdayUserFriends(birthdayUF);
      postActionSvc.postActionInfo('fbFriends',fbFriends.length,'Dashboard','Count');
    },true);

    // Refresh familly user friends when facebook family list arrives
    $scope.$watch(function() { return facebookSvc.getCurrentFamily(); }, function(fbFamily) {
      if ( !fbFamily ) return;
      //console.log("facebookSvc.getCurrentFamily() : " +res.length );
      ufHelperSvc.addFbFriendsToUserFriendsIfAbsent(fbFamily,ufSvc.getUFList());
      ufHelperSvc.updateUserFriendContextIfPresentInFbList(fbFamily,ufSvc.getUFList(),'familialContext');

      //console.log(fbFamily.length);
      postActionSvc.postActionInfo('fbFamily',fbFamily.length,'Dashboard','Count');

    },true);

  }]);
