angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope', 'HelperSvc', 'currentUserFriendSvc','DateHelperSvc','textsSvc','filterHelperSvc','facebookHelperSvc','currentUser','filteredTextsHelperSvc','facebookSvc','contextStyles','intentionsSvc','areasSvc',
  function ($scope, HelperSvc,  currentUserFriendSvc,DateHelperSvc,textsSvc,filterHelperSvc,facebookHelperSvc,currentUser,filteredTextsHelperSvc,facebookSvc,contextStyles,intentionsSvc,areasSvc) {
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
    $scope.posterFilters = initializeFiltersForPoster(posterFriend.gender);


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
      if ( $scope.posterFullTextList.length > 0 )
        $scope.posterFilteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.posterFullTextList, currentUser, $scope.posterFilters.preferredStyles, $scope.posterFilters);
    }

    // TODO : we should watch posterFriend filters, then merge them with poster filters if needed

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
      if ( posterFriend.ufContext == 'familialContext' )
        valret += " F";
      $scope.userFriendInfo = valret;
    };

    function initializeFiltersForPoster(gender) {
      // Initialize filters
      var retval = filterHelperSvc.createEmptyFilters();
      // Set gender filter
      if (!!gender)
        retval.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(gender);
      return retval;
    }

  }]);
