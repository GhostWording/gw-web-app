// Asks user about filters to be applied to the next query
cherryApp.controller('FilterDialogController', ['$scope', 'HelperService','NormalTextFilters','TheTexts','PostActionSvc','FilterVisibilityHelperSvc',
	function ($scope, HelperService, TextFilters,TheTexts,PostActionSvc,FilterVisibilityHelperSvc) {
        $scope.PostBox = PostActionSvc;
        $scope.BasicFilters = TextFilters;

        var initializeFilterModal = function () {
//            console.log('initializeFilterModal');
//            $scope.romantic = TextFilters.getSylesToExclude()['romantic'];
//            $scope.effusive = TextFilters.getSylesToExclude()['effusive'];
//            $scope.colloquial = TextFilters.getSylesToExclude()['colloquial'];
//            $scope.racy = TextFilters.getSylesToExclude()['racy'];
//            $scope.caustic = TextFilters.getSylesToExclude()['caustic'];
//            $scope.humorous = TextFilters.getSylesToExclude()['humorous'];
//            $scope.eccentric = TextFilters.getSylesToExclude()['eccentric'];
//            $scope.simple = TextFilters.getSylesToExclude()['simple'];

//            $scope.citationPrefered = TextFilters.setStyleToPrefer('humorous',false);
//            $scope.citationPrefered = TextFilters.setStyleToPrefer('imaginative',false);
//            $scope.citationPrefered = TextFilters.setStyleToPrefer('eccentric',false);
//            $scope.citationPrefered = TextFilters.setStyleToPrefer('simple',false);
//            $scope.citationPrefered = TextFilters.setStyleToPrefer('poetic',false);
//            $scope.citationPrefered = TextFilters.setStyleToPrefer('citation',false);


            $scope.humorousPrefered = TextFilters.getStyleToPrefer('humorous');
            $scope.imaginativePrefered = TextFilters.getStyleToPrefer('imaginative');
            $scope.eccentricPrefered = TextFilters.getStyleToPrefer('eccentric');
            $scope.simplePrefered = TextFilters.getStyleToPrefer('simple');
            $scope.poeticPrefered = TextFilters.getStyleToPrefer('poetic');
            $scope.citationPrefered = TextFilters.getStyleToPrefer('citation');

//            $scope.humorousPrefered = TextFilters.getSylesToPrefer()['humorous'];
//            $scope.imaginativePrefered = TextFilters.getSylesToPrefer()['imaginative'];
//            $scope.eccentricPrefered = TextFilters.getSylesToPrefer()['eccentric'];
//            $scope.simplePrefered = TextFilters.getSylesToPrefer()['simple'];
//            $scope.poeticPrefered = TextFilters.getSylesToPrefer()['poetic'];
//            $scope.citationPrefered = TextFilters.getSylesToPrefer()['citation'];
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

        initializeFilterModal();
        initializeContextFiltersModal();

        // Style filters
        $scope.filters = TextFilters.valuesToWatch;
        $scope.$watch('filters()',initializeFilterModal,true);

        $scope.TogglePreferedStyle = function(key,scopeVariable) {
            var newValue = ! $scope[scopeVariable];
            TextFilters.setStyleToPrefer(key,newValue);
            $scope.PostBox.postActionInfo('Command',key + ' - ' + newValue ,'FilterDialog');
        };

        $scope.displayNbFilteredTexts = TheTexts.hasfilteredTexts;
        $scope.nbFilteredTexts = TheTexts.nbfilteredTexts;
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
//            TextFilters.setContextToInclude(key,$scope.ContextFilters[scopeVariable]);
            TextFilters.setContextToInclude(key,newValue);
            $scope.PostBox.postActionInfo('Command',key + ' - ' +  scopeVariable,'FilterDialog');

        };

        $scope.shouldDisplayContextFilters = FilterVisibilityHelperSvc.shouldDisplayContextFilters;
        $scope.shouldDisplayThisContextFilter = FilterVisibilityHelperSvc.shouldDisplayThisContextFilter;

    }]);