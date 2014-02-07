

cherryApp.factory('CurrentTextList', [
    '$http', '$rootScope', '$routeParams','$filter', 'AppUrlSvc',  'HelperService', 'cacheSvc', 'TextFilterHelperSvc','NormalTextFilters','SelectedArea','SelectedIntention',
    function($http, $rootScope, $routeParams, $filter, AppUrlSvc,  HelperService, cacheSvc, TextFilterHelperSvc,TextFilters,SelectedArea,SelectedIntention) {

    var areaId, intentionId, currentTextList;

    var o = {
        getCurrentTextList: function() {
            return currentTextList;
        },
        minSortOrderToGetShuffled: 25
    };

    // Update cache when current intention changes (using MostRecentTextUpdateEpoch intention property)
//   $rootScope.$watch( SelectedIntention.getSelectedIntention,
//        function(intention) {
//            console.log("changed");
//            var areaId = SelectedArea.getSelectedAreaName();
//            var intentionId = SelectedIntention.getSelectedIntentionId();
//            //...
//        }
//   );

    // Ask the cache for a new list when route changes + area and intention can be read from route
    $rootScope.$watch(function() { return $routeParams; }, function(event, route) {
        areaId = $routeParams.areaId;
        intentionId = $routeParams.intentionId;

        if( areaId && intentionId ) {
            getTextList(intentionId, areaId).then(function(textList) {
                currentTextList = textList;
            });
        }
    }, true);

    // Ask the cache for a new list when filtering option change
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

        // This key concerns the raw text list for an areaId + intentionId
        var rawTextListkey =cacheKey(intentionId, areaId, "");
        // Text list considering sorting and filtering options such as recipient gender, prefered styles, etc.
        var textListWithOptionsKey =cacheKey(intentionId, areaId, TextFilters.valuesToWatch());

        // TODO: we should get this from the current intention service
        var lastChange = 0;
        var intention = SelectedIntention.getSelectedIntention();
        if (intention ) {
            lastChange = intention.MostRecentTextUpdateEpoch;
            console.log("lastChange :" + lastChange + " for " + intention.Label );
            // Delete cache entries that are not up to date with lastChange number
            cacheSvc.update(rawTextListkey,lastChange);
            cacheSvc.update(textListWithOptionsKey,lastChange);
        }


        // We first look in the cache for the raw text , with blank sortAndFilterOptions
        return  cacheSvc.get(rawTextListkey, lastChange, function () {
            // The cache didn't have it so load it up
            return loadTextList(intentionId, areaId)
                .then(function (texts) {
                    return  $filter('GenerateHtmlFields')(texts);
                }
            );
        })
            // Then we look for a cached version of the filtered list : if it does not exist in the cache allready we just filter what we got from the previous step
            .then(function (texts) {
                return cacheSvc.get(textListWithOptionsKey, lastChange, function () {
                    // And feed the cache with the filtered result if not allready there
                    return filterAndReorder(texts, TextFilters);
                },true); // Skip local storage for the filtered list : only cache it in memory
            })
            .then(function (texts) {
                // TODO : quality control on the texts here, to look for properties that may be outdated
                // If anything wrong, delete them from cache and local storage with cacheSvc.update(rawTextListkey,-1);
                return texts;
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
