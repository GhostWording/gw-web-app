// Asks user about filters to be applied to the next query
cherryApp.controller('FilterDialogController', ['$scope', 'HelperService','NormalTextFilters','PostActionSvc','FilterVisibilityHelperSvc','CurrentTextList','SelectedIntention',
	function ($scope, HelperService, TextFilters,PostActionSvc,FilterVisibilityHelperSvc,CurrentTextList,SelectedIntention) {
        $scope.BasicFilters = TextFilters;

        var initializeFilterModal = function () {
//            $scope.romantic = TextFilters.getSylesToExclude()['romantic'];
//            $scope.citationPrefered = TextFilters.setStyleToPrefer('humorous',false);

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
            $scope.ContextFilters.professional = contexts.professionalContext;
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
            PostActionSvc.postActionInfo('Command',scopeVariable,'StyleDialog','click',newValue);
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
            PostActionSvc.postActionInfo('Command',key,'StyleDialog','click',newValue);

        };

        $scope.shouldDisplayContextFilters = FilterVisibilityHelperSvc.shouldDisplayContextFilters;
        $scope.shouldDisplayThisContextFilter = FilterVisibilityHelperSvc.shouldDisplayThisContextFilter;

    }]);