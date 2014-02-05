

cherryApp.factory('CurrentTextList', [
    '$rootScope', 'AppUrlSvc', 'OrderBySortOrderExceptFor0Filter', 'HelperService', 'cacheSvc', 'TextFilterHelperSvc',
    function($rootScope, AppUrlSvc, OrderBySortOrderExceptFor0Filter, HelperService, cacheSvc, TextFilterHelperSvc) {

    var areaId, intentionId, currentTextList;

    $rootScope.$on('$routeChangeSuccess', function(event, route) {
        areaId = $route.params.areaId;
        intentionId = $route.params.intentionId;

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

            return OrderBySortOrderExceptFor0Filter(texts);
        })
        
        .then(function(texts) {
            return HelperService.shuffleTextIfSortOrderNotLessThan(texts, o.minSortOrderToGetShuffled);
        }, function (response) {
            console.log(response.status + "*");
            throw response;
        });
    }

    // This function is just used to identify the text list in the cache
    function cacheKey(intentionId, areaId) {
        return 'text-list:' + intentionId + ':' + areaId;
    }

    // Call this to get a promise to a list of texts for the given intention and area
    function getTextList(intentionId, areaId) {
        // Here we ask for a text list from the cache
        return cacheSvc.get(cacheKey(intentionId, areaId), function() {
            // The cache didn't have it so load it up
            return loadTextList(intentionId, areaId);
        });
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

    return {
        getCurrentTextList: function() {
            return currentTextList;
        }
    };

}]);
