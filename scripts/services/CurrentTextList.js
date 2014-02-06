

cherryApp.factory('CurrentTextList', [
    '$http', '$rootScope', '$routeParams', 'AppUrlSvc',  'HelperService', 'cacheSvc', 'TextFilterHelperSvc','NormalTextFilters','SelectedArea','SelectedIntention',
    function($http, $rootScope, $routeParams, AppUrlSvc,  HelperService, cacheSvc, TextFilterHelperSvc,TextFilters,SelectedArea,SelectedIntention) {

    var areaId, intentionId, currentTextList;

    var o = {
        getCurrentTextList: function() {
            return currentTextList;
        },
        minSortOrderToGetShuffled: 25
    };

    $rootScope.$watch(function() { return $routeParams; }, function(event, route) {
        areaId = $routeParams.areaId;
        intentionId = $routeParams.intentionId;

        if( areaId && intentionId ) {
            getTextList(intentionId, areaId).then(function(textList) {
                currentTextList = textList;
            });
        }
    }, true);

    $rootScope.$watch(TextFilters.valuesToWatch,
        function() {
            var areaId = SelectedArea.getSelectedAreaName();
            var intentionId = SelectedIntention.getSelectedIntentionId();

            if( areaId && intentionId ) {
                getTextList(intentionId, areaId).then(function(textList) {
                    currentTextList = textList;
                });
            }
        });


    function loadTextList(intentionId, areaId, limit) {

        limit = limit || 10000;

        var url = AppUrlSvc.urlTextsForIntention(intentionId, areaId);

        console.log('getting texts from:', url);

        return $http({
            method: 'GET',
            cache: false,
            url: url,
            params: {n: limit, s: 0},
            //  headers: {"Content-Type":"application/json","Accept":"application/vnd.cyrano.textspage-v1.1+json"}
            headers: {"Accept-Language": "fr-FR"}
        })

        .then(function(response) {
            var texts = response.data;
            console.log('text response:', response.status);
            console.log(texts.length + " texts pour l'intention " + intentionId);
            return texts;
        })
        .then(function(texts) {
                //return filterAndReorder(texts, TextFilters);
                return texts;
        }, function (response) {
            console.log(response.status + "*");
            throw response;
        });
    }

    // This function is just used to identify the text list in the cache
    function cacheKey(intentionId, areaId, sortAndFilterOptions) {
        return 'text-list:' + intentionId + ':' + areaId + ':' + sortAndFilterOptions;
    }

    // Call this to get a promise to a list of texts for the given intention and area
    function getTextList(intentionId, areaId) {

        // TODO: we should get this from the current intention service
        var lastChange = 1000;
        // How should we process the text list for options such as recipient gender, prefered styles, etc.
        var sortAndFilterOptions = TextFilters.valuesToWatch();

        // We first look ask for a text list from the cache with no filtering
        return  cacheSvc.get(cacheKey(intentionId, areaId, ""), lastChange, function () {
            // The cache didn't have it so load it up
            return loadTextList(intentionId, areaId)
                .then(function (texts) {
                    //var filteredTexts = filterAndReorder(texts, TextFilters);
                    //return filteredTexts;
                    return texts;
                }
            );
        })
            // Then we look for a cached version of the filtered list : if it does not exist in the cache allready we just filter what we got from the previous step
            .then(function (texts) {
                return cacheSvc.get(cacheKey(intentionId, areaId, sortAndFilterOptions), lastChange, function () {
                    // And feed the cache with the filtered result if not allready there
                    return filterAndReorder(texts, TextFilters);
                },true); // Skip local storage for the filtered list : only cache it in memory
            })
            ;
    }

    // Call this when you receive information that the text list has been updated on the server
    function textListChanged(intentionId, areaId, changeId) {
        cacheSvc.update(cacheKey(intentionId, areaId), changeId);
    }

    function filterAndReorder(textList, textFilters) {
        console.log('filterAndReorder');

        // Checks compatibility with sender, recipient, TuOuVous, Closeness....
        var t = TextFilterHelperSvc.filterOnBasicFilters(textList, textFilters);
        // Randomize order except for top texts
        t = HelperService.shuffleTextIfSortOrderNotLessThan(t, o.minSortOrderToGetShuffled);
        // Reorder using favorite tags
        TextFilterHelperSvc.reorderUsingPreferedFilters(t, textFilters);

        return t;
    }

    return o;
}]);
