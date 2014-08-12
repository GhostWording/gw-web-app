angular.module('app/userDashboard/BoardPosterController', [])
.controller('BoardPosterController', ['$scope',  'DateHelperSvc','currentUser','filteredTextsHelperSvc','facebookSvc','$modal','recipientsHelperSvc','subscribableRecipientsSvc','userFriendHelperSvc','boardPosterHelperSvc',
  function ($scope,  DateHelperSvc,currentUser,filteredTextsHelperSvc,facebookSvc,$modal,recipientsHelperSvc,subscribableRecipientsSvc,userFriendHelperSvc,boardPosterHelperSvc) {
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
      return boardPosterHelperSvc.getRecipientTypeLabel(id);
    };

    // Get text list for poster intention from cache or server
    boardPosterHelperSvc.setPosterTextList($scope.poster);

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

    // When poster user friend properties change : update poster filters
    $scope.$watch(function() { return $scope.poster.userFriend;},function(res) {
      boardPosterHelperSvc.setPosterFilters($scope.poster);
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
