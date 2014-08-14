angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope', 'HelperSvc', 'DateHelperSvc','$modal', 'ufHelperSvc','boardPosterHelperSvc','currentBoardPosterSvc','dashboardContextStyles',
  function ($scope, HelperSvc, DateHelperSvc,$modal,ufHelperSvc,boardPosterHelperSvc,currentBoardPosterSvc,dashboardContextStyles) {

    // Initialize : most properties will be set by the $watch functions
    $scope.poster = {'fullTextList' : [], 'filteredTextList' : [], 'filters' : null, 'userFriend' : $scope.userFriend, 'section' : $scope.boardSection, 'postedText' : ''  };

    // Fetch text list to display from cache or server
    boardPosterHelperSvc.setPosterTextList($scope.poster);

    $scope.setCurrentPoster = function() {currentBoardPosterSvc.setCurrentPoster($scope.poster);};

    // Date functions
    $scope.DateHelperSvc = DateHelperSvc;
    $scope.displayDate   = DateHelperSvc.localDisplayDateWithMonth(new Date());

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

    // Show modal dialogs
    $scope.showNextQuestion = function () {
      if (!$scope.poster.userFriend.ufContext) $scope.showContextFilters(); else $scope.showRecipientTypes();
    };

    $scope.contextStyles = dashboardContextStyles;
    $scope.showContextFilters = function() {
      $modal.open({ templateUrl: 'views/dashboard/posterContextDialog.html', scope: $scope,controller: 'SimplePageController'});
      currentBoardPosterSvc.setCurrentPoster($scope.poster);
    };
    $scope.showRecipientTypes = function () {
      $modal.open({ templateUrl: 'views/dashboard/posterRecipientTypeDialog.html',scope: $scope,controller: 'SimplePageController'});
      currentBoardPosterSvc.setCurrentPoster($scope.poster);
    };


    // C2D9A4 <= 17
    // 5D79C9 18 tp 39
    // FC0342 40 to 64
    // AE098F 65 or more


    //$scope.currentProposition = "";

    function chooseRandomIndice(array) {
      var valret = -1;
      if ( !! array && array.length > 0 ) {
        valret = Math.floor(Math.random() * array.length);
      }
      //console.log(" =====> " + valret);
      return valret;
    }


    function choosRandomText() {
      var txtIndex = chooseRandomIndice($scope.poster.filteredTextList);
      $scope.poster.txtIndex = txtIndex;
      var txt = $scope.poster.filteredTextList[txtIndex];
      $scope.poster.postedText = HelperSvc.isQuote(txt) ? HelperSvc.insertAuthorInText(txt.Content, txt.Author) : txt.Content ;
    }

    $scope.refresh = function() {
      choosRandomText();
    };

    function makeNewTextProposition () {
      if ( !!$scope.poster.filteredTextList && $scope.poster.filteredTextList.length > 0 ) {
        choosRandomText();
      }
    }

    // Random text should be chosen bu poster when filteredTextList is set for the first time
    //makeNewTextProposition();
    $scope.$watch(function() { return $scope.poster.filteredTextList;},function() {
      makeNewTextProposition(); },true);

    // Update poster filtered text list
    function filterPosterTextList() { boardPosterHelperSvc.updateFilteredList($scope.poster); }

    // When poster user friend properties change : update poster filters
    $scope.$watch(function() { return $scope.poster.userFriend;},function() {
      boardPosterHelperSvc.setPosterFilters($scope.poster); },true);
    // When user context changes : update compatible recipient types
    $scope.$watch(function() { return $scope.poster.userFriend.ufContext;  }, function() {
      $scope.posterCompatibleRecipients = boardPosterHelperSvc.getCompatibleRecipients($scope.poster);
    },true);
    // When text list changes : filter text list
    $scope.$watch(function() { return $scope.poster.fullTextList;},function() { filterPosterTextList(); },true);
    // When filters change : filter text list
    $scope.$watch(function() { return $scope.poster.filters;},function() { filterPosterTextList(); },true);

  }]);
