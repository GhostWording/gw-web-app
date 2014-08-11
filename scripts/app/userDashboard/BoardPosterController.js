angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope', 'HelperSvc', 'currentUserFriendSvc','DateHelperSvc','textsSvc','filterHelperSvc','facebookHelperSvc','currentUser','filteredTextsHelperSvc','facebookSvc','intentionsSvc','areasSvc','dashboardContextStyles','$modal',
  function ($scope, HelperSvc,  currentUserFriendSvc,DateHelperSvc,textsSvc,filterHelperSvc,facebookHelperSvc,currentUser,filteredTextsHelperSvc,facebookSvc,intentionsSvc,areasSvc,dashboardContextStyles,$modal) {
    // Date functions
    $scope.fbBirthdayHasDayAndMonth = DateHelperSvc.fbBirthdayHasDayAndMonth;
    $scope.fbBirthdayHasYear        = DateHelperSvc.fbBirthdayHasYear;
    $scope.fbBirthdayToDisplay      = DateHelperSvc.fbBirthdayToDisplay;
    $scope.fbAgeToDisplay           = DateHelperSvc.fbAgeToDisplay;
    $scope.displayDate              = DateHelperSvc.localDisplayDateWithMonth(new Date());

    var thisSection = $scope.section;
    var posterFriend = $scope.userFriend;

    //console.log("Section : " + thisSection.sectionLabel + " friend " + thisFriend.name);
    $scope.posterFullTextList = [];
    $scope.posterFilteredTextList = [];
    $scope.posterFilters = null; //= filterHelperSvc.createEmptyFilters();//initializeFiltersForPoster(posterFriend.gender);
    $scope.contextStyles = dashboardContextStyles;

    $scope.setContext = function(contextStyle) {
      $scope.userFriend.ufContext = contextStyle.name;
      console.log(contextStyle);
    };

    var intentionSlug = thisSection.sectionType == 'intention' ? thisSection.sectionTargetId : 'none-for-the-time-being';
    textsSvc.getListForCurrentArea(intentionSlug).then(function (textList) {
      $scope.posterFullTextList = textList;
      // In cacheSvc the texts are copied as in return angular.copy(value); = if the app gets slow we might want to send the original (not to be modified) list
      // Check server for newer version in case cache is stale
      intentionsSvc.invalidateCacheIfNewerServerVersionExists(areasSvc.getCurrentName(),intentionSlug)
      // Then you may want to update current display (or leave it as it si : cache will be good next time)
        .then(function(shouldReload){  if (shouldReload)  { textsSvc.getListForCurrentArea(intentionSlug).then(function (newTextList) {
         $scope.posterFullTextList = newTextList;}); } });
    });

    function filterPosterTextList() {
      if ( $scope.posterFullTextList.length > 0 && !! $scope.posterFilters )
        $scope.posterFilteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.posterFullTextList, currentUser, $scope.posterFilters.preferredStyles, $scope.posterFilters);
    }

    function showContextFilters () {
      $modal.open({
        templateUrl: 'views/partials/posterContextDialog.html',
        scope: $scope,
        controller: 'BoardPosterController'
      });
    }

    $scope.askForContext = showContextFilters;

    // TODO : we should watch posterFriend filters, then merge them with poster filters if needed

    $scope.$watch(function() { return posterFriend;},function(res) {
      // When user friend property change, initialize poster filters
      if ( ! $scope.posterFilters )
        $scope.posterFilters = filterHelperSvc.createEmptyFilters();
      if ( posterFriend ) {
        // Set gender filter
        if ( posterFriend.gender)
          $scope.posterFilters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(posterFriend.gender);
        // Set context filter
        if ( !! posterFriend.ufContext ) {
          //var availableContextsStyles = dashboardContextStyles;
          var contextStyle = dashboardContextStyles.stylesByName[posterFriend.ufContext];
          filterHelperSvc.setContextTypeTag($scope.posterFilters, contextStyle);
        }
        // Set Recipient type filter
        // =>  filterHelperSvc.setRecipientTypeTag($scope.posterFilters, recipientTypeTag);
      }
    },true);


    // Temporary for testing
    $scope.$watch(function() { return $scope.dashBoardRecipientType;  }, function() {
      if ( !! $scope.posterFilters && !! $scope.dashBoardRecipientType  )
        filterHelperSvc.setRecipientTypeTag($scope.posterFilters, $scope.dashBoardRecipientType.RecipientTypeId);
    },true);

    $scope.$watch(function() { return $scope.posterFullTextList;},function() {
      filterPosterTextList();
      setUserFrienInfo();
    },true);

    $scope.$watch(function() { return $scope.posterFilters;},function() {
      filterPosterTextList();
      setUserFrienInfo();
    },true);


    var setUserFrienInfo = function() {
      var valret = "";
      valret ="";
      valret += $scope.posterFilteredTextList.length;
      valret += " / ";
      valret += $scope.posterFullTextList.length;
      $scope.userFriendInfo = valret;
    };

  }]);
