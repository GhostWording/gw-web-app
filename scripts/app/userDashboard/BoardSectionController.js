angular.module('app/userDashboard/BoardSectionController', [])
.controller('BoardSectionController', ['$scope', 'HelperSvc', 'userFriendHelperSvc','facebookSvc','textsSvc',
  function ($scope, HelperSvc,  userFriendHelperSvc,facebookSvc,textsSvc) {
    var thisSection = $scope.section;
    console.log(thisSection);
    //$scope.sectionFriends = ['a','b','c'];

    // To store information provided by user on his friends / recipients
    $scope.sectionUserFriends = {};
    //$scope.sectionTextList = [];

    function prepareSectionTextList(sectionTargetId) {
      // Get text list promise from cache or server
      textsSvc.getListForCurrentArea(sectionTargetId).then(function (textList) {
        //$scope.sectionTextList = textList;
        //userFriendHelperSvc.initializeTextListForUserFriends($scope.userFriends,textList,contextStyles.createEmptyListForDashboard(),facebookSvc.getCurrentFamily(),currentUser);
        //updateUFriendListDisplay(userFriends);
        // Check server for newer version in case cache is stale
        // intentionsSvc.invalidateCacheIfNewerServerVersionExists(areasSvc.getCurrentName(),"happy-birthday")
        // Then you may want to update current display (or leave it as it si : cache will be good next time)
        //  .then(function(shouldReload){  if (shouldReload)  // refresh texts     });

      });
    }

    // Find user friends related to this board section
    if ( thisSection.sectionType == 'intention'  ) {
      // Special sourcing for birthdayfriends
      if ( thisSection.sectionTargetId == 'happy-birthday' ) {
        // If friends comme from facebook, watch when they arrive then convert them to user friends
        $scope.$watch(function() { return facebookSvc.getSortedFriendsWithBirthday(); }, function() {
          console.log("facebookSvc.getSortedFriendsWithBirthDay() : " +facebookSvc.getSortedFriendsWithBirthday().length );
          var fbFriends =  facebookSvc.getNextBirthdayFriend(3);
          userFriendHelperSvc.addFbFriendsToUserFriends(fbFriends,$scope.sectionUserFriends);
          prepareSectionTextList(thisSection.sectionTargetId);
        },true);
      }
      // For other sections, make a list or userFriend either from converted facebook friends or from converted possible recipients
      // For familly its possible to bootstrap from facebook and suggest other choices
      else {

      }
    }



  }]);
