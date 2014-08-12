angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope',  'DateHelperSvc','$modal', 'userFriendHelperSvc','boardPosterHelperSvc','currentBoardPosterSvc',
  function ($scope, DateHelperSvc,$modal,userFriendHelperSvc,boardPosterHelperSvc,currentBoardPosterSvc) {

    // Initialize : most properties will be set by the $watch functions
    $scope.poster = {'fullTextList' : [], 'filteredTextList' : [], 'filters' : null, 'userFriend' : $scope.userFriend, 'section' : $scope.section  };

    // Fetch text list to display from cache or server
    boardPosterHelperSvc.setPosterTextList($scope.poster);


    $scope.setCurrentPoster = function() {
      currentBoardPosterSvc.setCurrentPoster($scope.poster);
    };

    // Date functions
    $scope.DateHelperSvc = DateHelperSvc;
    $scope.displayDate   = DateHelperSvc.localDisplayDateWithMonth(new Date());

    // Get / Set functions
    $scope.setContext = function(contextStyle) {
      userFriendHelperSvc.setUFriendContextName($scope.poster.userFriend,contextStyle.name);
    };
    $scope.setRecipientTypeId = function(id) { $scope.poster.userFriend.ufRecipientTypeId = id; };
    $scope.getRecipientTypeLabel = function(id) { return boardPosterHelperSvc.getRecipientTypeLabel(id); };
    $scope.getUserFriendInfo = function() { return boardPosterHelperSvc.getPosterDebugInfo($scope.poster); };

    // Show modal dialogs
    $scope.showNextQuestion = function () {
      if (!$scope.poster.userFriend.ufContext) $scope.showContextFilters(); else $scope.showRecipientTypes();
    };
    $scope.showContextFilters = function() {
      $modal.open({ templateUrl: 'views/partials/posterContextDialog.html', scope: $scope,controller: 'BoardPosterController'});
      currentBoardPosterSvc.setCurrentPoster($scope.poster);
    };
    $scope.showRecipientTypes = function () {
      $modal.open({ templateUrl: 'views/partials/posterRecipientTypeDialog.html',scope: $scope,controller: 'BoardPosterController'});
      currentBoardPosterSvc.setCurrentPoster($scope.poster);
    };

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
