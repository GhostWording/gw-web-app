angular.module('app/userDashboard/BoardSectionController', [])
.controller('BoardSectionController', ['$scope', 'HelperSvc', 'userFriendHelperSvc','facebookSvc','textsSvc',
  function ($scope, HelperSvc,  userFriendHelperSvc,facebookSvc,textsSvc) {
    var thisSection = $scope.section;

    // To store information provided by user on his friends / recipients
    $scope.sectionUserFriends = {};

    // Find user friends related to this board section
    if ( thisSection.sectionType == 'intention'  ) {
      // Special sourcing for birthdayfriends
      if ( thisSection.sectionTargetId == 'happy-birthday' ) {
        // If friends comme from facebook, watch when they arrive then convert them to user friends
        $scope.$watch(function() { return $scope.birthDayUserFriends; }, function(res) {
          console.log("$scope.birthDayUserFriends : " +res.length );
          $scope.sectionUserFriends = $scope.birthDayUserFriends;

        },true);
      }
      // For other sections, make a list or userFriend either from converted facebook friends or from converted possible recipients
      // For familly its possible to bootstrap from facebook and suggest other choices
      else {

      }
    }



  }]);
