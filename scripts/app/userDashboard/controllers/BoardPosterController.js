angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope', 'helperSvc', 'dateHelperSvc','$modal', 'ufHelperSvc','boardPosterHelperSvc','currentBoardPosterSvc','dashboardContextStyles','intentionsSvc',
  function ($scope, helperSvc, dateHelperSvc,$modal,ufHelperSvc,boardPosterHelperSvc,currentBoardPosterSvc,dashboardContextStyles,intentionsSvc) {
    // Initialize : most properties will be set by $watch functions
    $scope.poster = {'fullTextList' : [], 'filteredTextList' : [], 'filters' : null, 'userFriend' : $scope.userFriend, 'section' : $scope.boardSection, 'posterTextContent' : '','posterText' : undefined  };

    // Fetch text list to display from cache or server
    boardPosterHelperSvc.setPosterTextList($scope.poster);

    $scope.setCurrentPoster = function() {currentBoardPosterSvc.setCurrentPoster($scope.poster);};

    // Date functions
    $scope.dateHelperSvc = dateHelperSvc;
    $scope.displayDate   = dateHelperSvc.localDisplayDateWithMonth(new Date());

    // Get / Set functions
    $scope.nbInfoWasProvided = 0;
    $scope.setContext = function(contextStyle) {
      ufHelperSvc.setUFriendContextName($scope.poster.userFriend,contextStyle.name);
      $scope.nbInfoWasProvided++;
//      console.log("$scope.nbInfoWasProvided++ => " + $scope.nbInfoWasProvided );
    };
    $scope.setRecipientTypeId = function(id) {
      $scope.poster.userFriend.ufRecipientTypeId = id;
      $scope.nbInfoWasProvided++;
    };
    $scope.getMakeBetterLabel = function() {
      return $scope.nbInfoWasProvided === 0 ? "Améliorer" : "Améliorer encore";
    };

    $scope.getRecipientTypeLabel = function(id) { return boardPosterHelperSvc.getRecipientTypeLabel(id); };
    $scope.getUserFriendInfo = function() { return boardPosterHelperSvc.getPosterDebugInfo($scope.poster); };

    $scope.getPosterIntentionSlug = function() {
      var retval;
      var intention = $scope.poster.section.intention;
      if ( intention )
        // This will be a localized slug, so its the preferred way
        retval = intentionsSvc.getSlugOrId(intention);
      else
       // In other cases, we should have a valid intention id here
        retval =  $scope.poster.section.sectionTargetId;
      return retval;
    };

    $scope.getPosterTextId = function() {
      var retval = '';
      if ( $scope.poster.posterText )
        retval = $scope.poster.posterText.TextId;
      return retval;
    };

      // Show modal dialogs
    $scope.showNextQuestion = function () {
      if (!$scope.poster.userFriend.ufContext) $scope.showContextFilters(); else $scope.showRecipientTypes();
    };

    $scope.contextStyles = dashboardContextStyles;
    $scope.showContextFilters = function() {
      $modal.open({ templateUrl: 'views/dashboard/posterContextDialog.html', scope: $scope,controller: 'SimplePageController'});
    };
    $scope.showRecipientTypes = function () {
      $modal.open({ templateUrl: 'views/dashboard/posterRecipientTypeDialog.html',scope: $scope,controller: 'SimplePageController'});
    };
    $scope.showInviteFriend = function () {
      $modal.open({ templateUrl: 'views/dashboard/posterInviteFriendDialog.html',scope: $scope,controller: 'SimplePageController'});
    };

    $scope.recipientTypesQuestionVisible = function() {
      var valret = true;
      return valret;
    };
    $scope.refreshCount = 0;
    $scope.maxRefreshCount = 3;

    $scope.moreQuestionsCanBeShown = function() {
      var valret = true;
      if ( $scope.poster.userFriend.ufRecipientTypeId )
        return false;
      if ( $scope.poster.userFriend.ufContext == 'proContext' )
        return false;
      return valret;
    };

    $scope.moreRefreshesAvailable = function() {
      return $scope.refreshCount < $scope.maxRefreshCount ;
    };



    function chooseRandomIndice(array) {
      var valret = -1;
      if ( !! array && array.length > 0 ) {
        valret = Math.floor(Math.random() * array.length);
      }
      return valret;
    }

    function choosRandomText() {
      var txtIndex = chooseRandomIndice($scope.poster.filteredTextList);
      $scope.poster.txtIndex = txtIndex;
      var txt = $scope.poster.filteredTextList[txtIndex];
      $scope.poster.posterTextContent = helperSvc.isQuote(txt) ? helperSvc.insertAuthorInText(txt.Content, txt.Author) : txt.Content ;
      $scope.poster.posterText = txt;
    }

    $scope.refresh = function() {
      choosRandomText();
      $scope.refreshCount++;
    };

    function makeNewTextProposition () {
      if ( !!$scope.poster.filteredTextList && $scope.poster.filteredTextList.length > 0 ) {
        choosRandomText();
      }
    }

    // Random text should be chosen bu poster when filteredTextList is set for the first time
    //makeNewTextProposition();
    $scope.$watch(function() { return $scope.poster.filteredTextList;},function() {
      makeNewTextProposition();
    },false); // !!! Looks like text content might be modified in text detail view, so we might not want to look into those

    // Update poster filtered text list
    function filterPosterTextList() {
      boardPosterHelperSvc.updateFilteredList($scope.poster); }

    // When poster user friend properties change : update poster filters
    $scope.$watch(function() { return $scope.poster.userFriend;},function() {
      boardPosterHelperSvc.setPosterFilters($scope.poster); },true);
    // When user context changes : update compatible recipient types
    $scope.$watch(function() { return $scope.poster.userFriend.ufContext;  }, function() {
      $scope.posterCompatibleRecipients = boardPosterHelperSvc.getCompatibleRecipients($scope.poster);
    },true);
    // When text list changes : filter text list
    $scope.$watch(function() { return $scope.poster.fullTextList;},function() {
      filterPosterTextList();
    },false); // !!! Looks like text content might be modified in text detail view, so we might not want to look into those
    // When filters change : filter text list
    $scope.$watch(function() { return $scope.poster.filters;},function() {
      $scope.poster.filters.useAgeTag = true; // TEMP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      filterPosterTextList(); },true);

  }]);
