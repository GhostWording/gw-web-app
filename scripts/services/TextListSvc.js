// Get texts for a given intention, filter them and order them

cherryApp.factory('TheTexts', ["$http","$filter","AppUrlSvc","HelperService","TextFilterHelperSvc","FilterVisibilityHelperSvc",
    function ($http,$filter,AppUrlSvc,HelperService,TextFilterHelperSvc,FilterVisibilityHelperSvc) {

    var o = {};
    // texts memorized from the last query
    o.texts = [];
    o.getAllTexts = function() {
        return o.texts;
    };
    o.resetTexts = function () {
        o.texts = [];
    };

    // Most popular texts are sorted by SortOrder. Other are shuffled
    o.minSortOrderToGetShuffled = 25;

    // memorize result of last filtering or ordering operation
    var filteredTexts = [];
    o.hasfilteredTexts = function() {
        return filteredTexts.length > 0;
    };
    o.nbfilteredTexts = function() {
        return filteredTexts.length;
    };
    o.filterAndReorder = function(textFilters) {
        //var t = o.filterCurrentTextList(textFilters);
        var t = TextFilterHelperSvc.filterOnBasicFilters(o.texts, textFilters);

        // Randomize order except for top texts
        t = HelperService.shuffleTextIfSortOrderNotLessThan(t, o.minSortOrderToGetShuffled);
        // Reorder using favorite tags
        TextFilterHelperSvc.reorderUsingPreferedFilters(t, textFilters);
        filteredTexts = t;
        return t;
    };

    // If a text array is fully loaded for an intention, it's stored as a property of this object
    o.textArraysForAreas = {};
    o.textsAlreadyCachedForIntention = function (intentionId) {
        return  ( o.textArraysForAreas[intentionId] !== undefined );
    };
    o.cacheReorderedTexts = function(t, intentionId) {
        o.textArraysForAreas[intentionId] = t;
    };

    // This is it : queries the texts (or return a cached copy if available)
    o.queryTexts = function (intentionId, areaId, doIfSuccess, doIfError, queryCompleteList, nbTexts) {
        if (queryCompleteList || nbTexts === undefined)
            nbTexts = 10000;
        // If cached, return texts
        if (queryCompleteList && o.textsAlreadyCachedForIntention(intentionId)) {
            console.log("textArraysForAreas for intention" + intentionId + " read from cache");
            o.texts = o.textArraysForAreas[intentionId];
            filteredTexts = o.texts;
            doIfSuccess(filteredTexts);
            return;
        }

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
                // Sort texts
                $filter('OrderBySortOrderExceptFor0')(texts);
                var sortedAndShuffled = HelperService.shuffleTextIfSortOrderNotLessThan(texts, o.minSortOrderToGetShuffled);

                // If all the texts were read for this intention, cache them for further use
                if (queryCompleteList)
                    o.textArraysForAreas[intentionId] = sortedAndShuffled;
                o.texts = sortedAndShuffled;
                filteredTexts = sortedAndShuffled;
                doIfSuccess(filteredTexts);
            })
            .error(function (data, status) {
                console.log(status + "*");
                doIfError();
            });
    };

  return o;
}]);