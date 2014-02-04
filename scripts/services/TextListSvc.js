// Get texts for a given intention, filter them and order them

cherryApp.factory('TheTexts', ["$http","$filter","AppUrlSvc","HelperService","TextFilterHelperSvc","FilterVisibilityHelperSvc",
function ($http,$filter,AppUrlSvc,HelperService,TextFilterHelperSvc,FilterVisibilityHelperSvc) {

    var o = {};
    // Texts from the last query (ie the last intentionId queried)
    o.texts = [];
    // Filtered and sorted text memorized from the last filtering/ordering operation
    o.filteredTexts = [];

    o.getAllTexts = function() {
        return o.texts;
    };
    o.resetTexts = function () {
        console.log('resetTexts');
        o.texts = [];
        o.filteredTexts = [];
    };

    o.hasFilteredTexts = function() {
        return o.filteredTexts.length > 0;
    };
    o.nbfilteredTexts = function () {
        return o.filteredTexts.length;
    };
    o.filterAndReorder = function(textFilters) {
        console.log('filterAndReorder');
        // Checks compatibility with sender, recipient, TuOuVous, Closeness....
        var t = TextFilterHelperSvc.filterOnBasicFilters(o.texts, textFilters);
        // Randomize order except for top texts
        t = HelperService.shuffleTextIfSortOrderNotLessThan(t, o.minSortOrderToGetShuffled);
        // Reorder using favorite tags
        TextFilterHelperSvc.reorderUsingPreferedFilters(t, textFilters);
        o.filteredTexts = t;
        return t;
    };
    // Most popular texts are sorted by SortOrder. Other are shuffled
    o.minSortOrderToGetShuffled = 25;


    // If a text array is fully loaded for an intention, it's stored as a property of this object
    o.cachedTextArraysForIntention = {};
    o.textsAlreadyCachedForIntention = function (intentionId) {
        return  ( o.cachedTextArraysForIntention[intentionId] !== undefined );
    };
    o.cacheReorderedTexts = function (t, intentionId) {
        o.cachedTextArraysForIntention[intentionId] = t;
    };

        // This is it : queries the texts (or return a cached copy if available)
    // We should deal with the language of the request
    o.queryTexts = function (intentionId, areaId, doIfSuccess, doIfError, queryCompleteList, nbTexts) {
        if (queryCompleteList || nbTexts === undefined)
            nbTexts = 10000;
        // If cached, return texts
        if (queryCompleteList && o.textsAlreadyCachedForIntention(intentionId)) {
            console.log("textArraysForAreas for intention" + intentionId + " read from cache");
            o.texts = o.cachedTextArraysForIntention[intentionId];
            o.filteredTexts = o.texts;
            doIfSuccess(o.filteredTexts);
            return;
        }
        // else reset them and query
        o.resetTexts();
        var url = AppUrlSvc.urlTextsForIntention(intentionId, areaId);
        console.log(url);
        $http({
            method: 'GET',
            cache: false,
            url: url,
            params: {n: nbTexts, s: 0},
            //  headers: {"Content-Type":"application/json","Accept":"application/vnd.cyrano.textspage-v1.1+json"}
            headers: {"Accept-Language": "fr-FR"}
        })
            .success(function (data, status) {
                console.log(status + "*");
                var texts = data;
                console.log(texts.length + " texts pour l'intention " + intentionId);
                // Texts will be stored sorted so that we dont have to resort them all the time
                $filter('OrderBySortOrderExceptFor0')(texts);
//                var sortedAndShuffled = HelperService.shuffleTextIfSortOrderNotLessThan(texts, o.minSortOrderToGetShuffled);
                var sortedTexts = texts;

                // If all the texts were read for this intention, cache them for further use
                if (queryCompleteList)
                    o.cachedTextArraysForIntention[intentionId] = sortedTexts;
                o.texts = sortedTexts;
                // Not now, that will be a later decision
                o.filteredTexts = sortedTexts;
                doIfSuccess(o.texts);
            })
            .error(function (data, status) {
                console.log(status + "*");
                doIfError();
            });
    };

  return o;
}]);