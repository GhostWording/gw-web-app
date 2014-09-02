// Asks user about filters to be applied to the next query
cherryApp.controller('FilterDialogController', ['$scope', 'HelperService','NormalTextFilters','postActionSvc','FilterVisibilityHelperSvc','CurrentTextList','SelectedIntention',
	function ($scope, HelperService, TextFilters,postActionSvc,FilterVisibilityHelperSvc,CurrentTextList,SelectedIntention) {
        $scope.BasicFilters = TextFilters;
        $scope.ContextFilters = {};

        var initializeFilterModal = function () {
            $scope.humorousPrefered = TextFilters.getStyleToPrefer('humorous');
            $scope.imaginativePrefered = TextFilters.getStyleToPrefer('imaginative');
            $scope.eccentricPrefered = TextFilters.getStyleToPrefer('eccentric');
            $scope.simplePrefered = TextFilters.getStyleToPrefer('simple');
            $scope.poeticPrefered = TextFilters.getStyleToPrefer('poetic');
            $scope.citationPrefered = TextFilters.getStyleToPrefer('citation');
        };

        var initializeContextFiltersModal = function () {
            //console.log('initializeContextFilterModal');
            var contexts = TextFilters.getContextsToInclude();
            $scope.ContextFilters.friendly = contexts.friendlyContext;
            $scope.ContextFilters.familial = contexts.familialContext;
            $scope.ContextFilters.professional = contexts.proContext;
            $scope.ContextFilters.administrative = contexts.administrativeContext;
            $scope.ContextFilters.couple = contexts.coupleContext;
            $scope.ContextFilters.inLove = contexts.romanticContext;
            $scope.ContextFilters.dating = contexts.datingContext;
        };

        $scope.$watch(SelectedIntention.getSelectedIntention,initializeFilterModal);

        initializeFilterModal();
        initializeContextFiltersModal();

        // Style filters
        $scope.filters = TextFilters.valuesToWatch;
        $scope.$watch('filters()',initializeFilterModal,true);

        $scope.TogglePreferedStyle = function(key,scopeVariable) {
            var newValue = ! $scope[scopeVariable];
            TextFilters.setStyleToPrefer(key,newValue);
            postActionSvc.postActionInfo('Command',scopeVariable,'StyleDialog','click',newValue);
        };

        $scope.displayNbFilteredTexts = CurrentTextList.hasTexts ;
        $scope.nbFilteredTexts = CurrentTextList.getNbTexts;

        $scope.nbTextLabel = function () {
            var retval = "texte";
            if ( $scope.nbFilteredTexts() > 1 )
                retval += 's';
            return retval;
        };

        // Context filters
        $scope.filters = TextFilters.contextValuesToWatch;
        $scope.$watch('filters()', initializeContextFiltersModal, true);

        $scope.ToggleIncludeContext = function(key,scopeVariable) {
            var newValue = ! $scope.ContextFilters[scopeVariable];
            TextFilters.setContextToInclude(key,newValue);
            postActionSvc.postActionInfo('Command',key,'StyleDialog','click',newValue);

        };

        // For the current areas, never display the context filters as they have been filtered on the server
        //$scope.shouldDisplayContextFilters = FilterVisibilityHelperSvc.shouldDisplayContextFilters;
        $scope.shouldDisplayContextFilters = function () {return false;};

        $scope.shouldDisplayThisContextFilter = FilterVisibilityHelperSvc.shouldDisplayThisContextFilter;

    }]);