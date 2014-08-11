angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope', 'HelperSvc', 'currentUserFriendSvc','DateHelperSvc','textsSvc','filterHelperSvc','facebookHelperSvc','currentUser','filteredTextsHelperSvc','facebookSvc','intentionsSvc','areasSvc','dashboardContextStyles','$modal','recipientsHelperSvc',
  function ($scope, HelperSvc,  currentUserFriendSvc,DateHelperSvc,textsSvc,filterHelperSvc,facebookHelperSvc,currentUser,filteredTextsHelperSvc,facebookSvc,intentionsSvc,areasSvc,dashboardContextStyles,$modal,recipientsHelperSvc) {
    // Date functions
    $scope.fbBirthdayHasDayAndMonth = DateHelperSvc.fbBirthdayHasDayAndMonth;
    $scope.fbBirthdayHasYear        = DateHelperSvc.fbBirthdayHasYear;
    $scope.fbBirthdayToDisplay      = DateHelperSvc.fbBirthdayToDisplay;
    $scope.fbAgeToDisplay           = DateHelperSvc.fbAgeToDisplay;
    $scope.displayDate              = DateHelperSvc.localDisplayDateWithMonth(new Date());

    var thisSection = $scope.section;
    var posterFriend = $scope.userFriend;

    $scope.posterFullTextList = [];
    $scope.posterFilteredTextList = [];
    $scope.posterFilters = null;
    $scope.contextStyles = dashboardContextStyles;

    $scope.setContext = function(contextStyle) {
      $scope.userFriend.ufContext = contextStyle.name;
      $scope.userFriend.ufRecipientTypeId = null;
      console.log(contextStyle);
    };

    $scope.setRecipientTypeId = function(id) {
      $scope.userFriend.ufRecipientTypeId = id;
    };
    $scope.getRecipientTypeLabel = function(id) {
      var valret = "";
      if ( !! id ) {
        var recipient = recipientsHelperSvc.getRecipientById($scope.possibleRecipients, id);
        valret = !!recipient ? recipient.dashLabel : "";
      }
      return valret;
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


    $scope.showNextQuestion = function () {
      if (!$scope.userFriend.ufContext)
        $scope.showContextFilters();
      else
        $scope.showRecipientTypes();
    };

    $scope.showContextFilters = function() {
      $modal.open({
        templateUrl: 'views/partials/posterContextDialog.html',
        scope: $scope,
        controller: 'BoardPosterController'
      });
    };
    $scope.showRecipientTypes = function () {
      $modal.open({
        templateUrl: 'views/partials/posterRecipientTypeDialog.html',
        scope: $scope,
        controller: 'BoardPosterController'
      });
    };

    // When user friend property change : update filters
    $scope.$watch(function() { return posterFriend;},function(res) {
      // When user friend property change, initialize poster filters
      if ( ! $scope.posterFilters )
        $scope.posterFilters = filterHelperSvc.createEmptyFilters();
      if ( res ) {
        // Set gender filter
        if ( res.gender)
          $scope.posterFilters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(res.gender);
        // Set context filter
        if ( !! res.ufContext ) {
          //var availableContextsStyles = dashboardContextStyles;
          var contextStyle = dashboardContextStyles.stylesByName[res.ufContext];
          filterHelperSvc.setContextTypeTag($scope.posterFilters, contextStyle);
        }
        if ( !! res.ufRecipientTypeId ) {
          var recipient = recipientsHelperSvc.getRecipientById($scope.possibleRecipients, res.ufRecipientTypeId);
          if ( recipient )
            filterHelperSvc.setRecipientTypeTag($scope.posterFilters, recipient.RecipientTypeId);
        }
      }
    },true);

    // Filter text list
    function filterPosterTextList() {
      if ( $scope.posterFullTextList.length > 0 && !! $scope.posterFilters )
        $scope.posterFilteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.posterFullTextList, currentUser, $scope.posterFilters.preferredStyles, $scope.posterFilters);
    }

    // When user context changes : update compatible recipient types
    $scope.$watch(function() { return $scope.userFriend.ufContext;  }, function(res) {
      $scope.compatibleRecipients = recipientsHelperSvc.getCompatibleRecipients($scope.possibleRecipients,currentUser,$scope.userFriend,facebookSvc.getCurrentMe(),res);
    },true);

    // When text list changes : filter text list
    $scope.$watch(function() { return $scope.posterFullTextList;},function() {
      filterPosterTextList();
      setUserFrienInfo();
    },true);

    // When filters change : filter text list
    $scope.$watch(function() { return $scope.posterFilters;},function() {
      filterPosterTextList();
      setUserFrienInfo();
    },true);


    // Debug info
    var setUserFrienInfo = function() {
      var valret = "";
      valret ="";
      valret += $scope.posterFilteredTextList.length;
      valret += " / ";
      valret += $scope.posterFullTextList.length;
      $scope.userFriendInfo = valret;
    };

  }]);
