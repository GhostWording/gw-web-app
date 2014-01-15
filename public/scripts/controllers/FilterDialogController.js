// Asks user about filters to be applied to the next query
cherryApp.controller('FilterDialogController', ['$scope', 'HelperService','NormalTextFilters','TheTexts','PostActionSvc',
	function ($scope, HelperService, TextFilters,TheTexts,PostActionSvc) {
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
            $scope.humorousPrefered = TextFilters.getStyleToPrefer('imaginative');
            $scope.humorousPrefered = TextFilters.getStyleToPrefer('eccentric');
            $scope.humorousPrefered = TextFilters.getStyleToPrefer('simple');
            $scope.humorousPrefered = TextFilters.getStyleToPrefer('poetic');
            $scope.humorousPrefered = TextFilters.getStyleToPrefer('citation');

//            $scope.humorousPrefered = TextFilters.getSylesToPrefer()['humorous'];
//            $scope.imaginativePrefered = TextFilters.getSylesToPrefer()['imaginative'];
//            $scope.eccentricPrefered = TextFilters.getSylesToPrefer()['eccentric'];
//            $scope.simplePrefered = TextFilters.getSylesToPrefer()['simple'];
//            $scope.poeticPrefered = TextFilters.getSylesToPrefer()['poetic'];
//            $scope.citationPrefered = TextFilters.getSylesToPrefer()['citation'];
        };

        var initializeContextFiltersModal = function () {
            //console.log('initializeContextFilterModal');
            $scope.ContextFilters.friendly = TextFilters.getContextsToInclude()['friendlyContext'];
            $scope.ContextFilters.familial = TextFilters.getContextsToInclude()['familialContext'];
            $scope.ContextFilters.professional = TextFilters.getContextsToInclude()['professionalContext'];
            $scope.ContextFilters.administrative = TextFilters.getContextsToInclude()['administrativeContext'];
            $scope.ContextFilters.couple = TextFilters.getContextsToInclude()['coupleContext'];
            $scope.ContextFilters.inLove = TextFilters.getContextsToInclude()['romanticContext'];
            $scope.ContextFilters.dating = TextFilters.getContextsToInclude()['datingContext'];
        };

        initializeFilterModal();
        initializeContextFiltersModal();

        // Style filters
        $scope.filters = TextFilters.valuesToWatch;
        $scope.$watch('filters()',initializeFilterModal,true);

        $scope.TogglePreferedStyle = function(key,scopeVariable) {
            var newValue = ! $scope[scopeVariable];
            TextFilters.setStyleToPrefer(key,newValue);
            $scope.PostBox.gulp('Command',key + ' - ' + newValue ,'FilterDialog');
        };
//        $scope.ToggleExcludedStyle = function(key) {
//            TextFilters.setStyleToExclude(key,$scope[key]);
//            $scope.PostBox.gulp('Command',key ,'FilterDialog');
//        };

//        $scope.o = {};
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
            $scope.PostBox.gulp('Command',key + ' - ' +  scopeVariable,'FilterDialog');

        };

        $scope.shouldDisplayContextFilters = TheTexts.shouldDisplayContextFilters;
        $scope.shouldDisplayThisContextFilter = TheTexts.shouldDisplayThisContextFilter;

    }]);