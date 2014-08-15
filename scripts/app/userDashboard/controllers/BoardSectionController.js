angular.module('app/userDashboard/BoardSectionController', [])
.controller('BoardSectionController', ['$scope', 'ufSvc','intentionsSvc',
  function ($scope, ufSvc,intentionsSvc  ) {

    // A board poster will be displayed for each user friend in the section
    $scope.sectionUserFriends = {};



    // Populate sectionUserFriends with relevant user friends for this section
    if ( $scope.boardSection.sectionType == 'intention'  ) {
      // Special sourcing for birthdayfriends
      if ( $scope.boardSection.sectionTargetId == 'happy-birthday' ) {

        intentionsSvc.getIntention($scope.currentAreaName,$scope.boardSection.sectionTargetId).then(function(intention) {
          //console.log(intention);
          $scope.boardSection.intention = intention;
        });
        // If friends comme from facebook, watch when they arrive then convert them to user friends
        $scope.$watch(function() { return ufSvc.getBirthdayUserFriends(); }, function(res) {
          console.log("ufSvc.birthDayUserFriends : " +res.length );
          $scope.sectionUserFriends = res;
        },true);
      }
      // For other sections, make a list or userFriend either from converted facebook friends or from converted possible recipients
      // For familly its possible to bootstrap from facebook and suggest other choices
      else {

      }
    }



  }]);
