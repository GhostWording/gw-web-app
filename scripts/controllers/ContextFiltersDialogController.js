// Asks user about filters to be applied to the next query : moved to another dialog for the time being
cherryApp.controller('ContextFiltersDialogController', ['$scope', 'HelperService', 'NormalTextFilters',
  function ($scope, HelperService, TextFilters) {
      //console.log('ContextFiltersDialogController');

//      $scope.BasicFilters = TextFilters;

        // Transfered to FilterDialogControllers
//      var initializeContextFiltersModal = function () {
//          //console.log('initializeContextFilterModal');
//            $scope.ContextFilters.friendly = TextFilters.getContextsToInclude()['friendlyContext'];
//            $scope.ContextFilters.familial = TextFilters.getContextsToInclude()['familialContext'];
//            $scope.ContextFilters.professional = TextFilters.getContextsToInclude()['professionalContext'];
//            $scope.ContextFilters.administrative = TextFilters.getContextsToInclude()['administrativeContext'];
//            $scope.ContextFilters.couple = TextFilters.getContextsToInclude()['coupleContext'];
//            $scope.ContextFilters.inLove = TextFilters.getContextsToInclude()['inLoveContext'];
//            $scope.ContextFilters.dating = TextFilters.getContextsToInclude()['datingContext'];
//      };
//
//      initializeContextFiltersModal();
//
//      $scope.filters = TextFilters.contextValuesToWatch;
//      $scope.$watch('filters()', initializeContextFiltersModal, true);
//
//        $scope.ToggleIncludeContext = function(key,scopeVariable) {
//            TextFilters.setContextToInclude(key,$scope.ContextFilters[scopeVariable]);
//        };

  }]);