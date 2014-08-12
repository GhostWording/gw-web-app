angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope', 'HelperSvc', 'currentUserFriendSvc','DateHelperSvc','textsSvc','filterHelperSvc','facebookHelperSvc','currentUser','filteredTextsHelperSvc','facebookSvc','intentionsSvc','areasSvc','dashboardContextStyles','$modal','recipientsHelperSvc','subscribableRecipientsSvc','userFriendHelperSvc',
  function ($scope, HelperSvc,  currentUserFriendSvc,DateHelperSvc,textsSvc,filterHelperSvc,facebookHelperSvc,currentUser,filteredTextsHelperSvc,facebookSvc,intentionsSvc,areasSvc,dashboardContextStyles,$modal,recipientsHelperSvc,subscribableRecipientsSvc,userFriendHelperSvc) {
    // Date functions
    $scope.DateHelperSvc = DateHelperSvc;
    $scope.displayDate   = DateHelperSvc.localDisplayDateWithMonth(new Date());

    $scope.poster = {'fullTextList' : [], 'filteredTextList' : [], 'filters' : null, 'userFriend' : $scope.userFriend, 'section' : $scope.section  };

    $scope.setContext = function(contextStyle) {
      userFriendHelperSvc.setUFriendContextName($scope.poster.userFriend,contextStyle.name);
    };
    $scope.setRecipientTypeId = function(id) {
      $scope.poster.userFriend.ufRecipientTypeId = id;
    };
    $scope.getRecipientTypeLabel = function(id) {
      var valret = "";
      if ( !! id ) {
        var recipient = recipientsHelperSvc.getRecipientById(subscribableRecipientsSvc.getAllPossibleRecipientsNow(), id);
        valret = !!recipient ? recipient.dashLabel : "";
      }
      return valret;
    };

    var intentionSlug = $scope.poster.section.sectionType == 'intention' ? $scope.poster.section.sectionTargetId : 'none-for-the-time-being';
        // In cacheSvc the texts are copied as in return angular.copy(value); = if the app gets slow we might want to send the original (not to be modified) list
    textsSvc.getListForCurrentArea(intentionSlug).then(function (textList) {
      $scope.poster.fullTextList = textList;
      // Cache is quick but it might be stale. Check server for newer version in case
      intentionsSvc.invalidateCacheIfNewerServerVersionExists(areasSvc.getCurrentName(),intentionSlug)
        // If newer version, we might want to update current display right away
        .then(function(shouldReload){  if (shouldReload)  { textsSvc.getListForCurrentArea(intentionSlug).then(function (newTextList) {
//         $scope.posterFullTextList = newTextList;
        $scope.poster.fullTextList = newTextList;
      }); } });
    });

    $scope.showNextQuestion = function () {
      if (!$scope.poster.userFriend.ufContext)
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
    $scope.$watch(function() { return $scope.poster.userFriend;},function(res) {
      // When user friend property change, initialize poster filters
      if ( ! $scope.poster.filters )
        $scope.poster.filters = filterHelperSvc.createEmptyFilters();
      if ( res ) {
        // Set gender filter
        if ( res.gender)
          $scope.poster.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(res.gender);
        // Set context filter
        if ( !! res.ufContext ) {
          //var availableContextsStyles = dashboardContextStyles;
          var contextStyle = dashboardContextStyles.stylesByName[res.ufContext];
          filterHelperSvc.setContextTypeTag($scope.poster.filters, contextStyle);
        }
        if ( !! res.ufRecipientTypeId ) {
          var recipient = recipientsHelperSvc.getRecipientById(subscribableRecipientsSvc.getAllPossibleRecipientsNow(), res.ufRecipientTypeId);
          if ( recipient )
            filterHelperSvc.setRecipientTypeTag($scope.poster.filters, recipient.RecipientTypeId);
        }
      }
    },true);

    // Filter text list
    function filterPosterTextList() {
      if ( $scope.poster.fullTextList.length > 0 && !! $scope.poster.filters )
        $scope.poster.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList($scope.poster.fullTextList, currentUser, $scope.poster.filters.preferredStyles, $scope.poster.filters);
    }

    // When user context changes : update compatible recipient types
    $scope.$watch(function() { return $scope.poster.userFriend.ufContext;  }, function(res) {
      $scope.compatibleRecipients = recipientsHelperSvc.getCompatibleRecipients(subscribableRecipientsSvc.getAllPossibleRecipientsNow(),currentUser,$scope.poster.userFriend,facebookSvc.getCurrentMe(),res);
    },true);

    // When text list changes : filter text list
    $scope.$watch(function() { return $scope.poster.fullTextList;},function() { filterPosterTextList(); },true);

    // When filters change : filter text list
    $scope.$watch(function() { return $scope.poster.filters;},function() { filterPosterTextList(); },true);

    // Debug info
    $scope.getUserFriendInfo = function() {
      var valret = "";
      valret ="";
      valret += $scope.poster.filteredTextList.length;
      valret += " / ";
      valret += $scope.poster.fullTextList.length;
      return valret;
    };

  }]);
