

cherryApp.factory('CurrentTextList', [
    '$http', '$rootScope', '$stateParams','$filter', 'AppUrlSvc',  'HelperService', 'cacheSvc', 'TextFilterHelperSvc','NormalTextFilters','currentArea','SelectedIntention','intentionApi',
    function($http, $rootScope, $stateParams, $filter, AppUrlSvc,  HelperService, cacheSvc, TextFilterHelperSvc,TextFilters,currentArea,SelectedIntention,intentionApi) {

    var areaName, intentionId, currentTextList;
    var completeTextListForIntention;

    var o = {
        getCurrentTextList: function() {
            return currentTextList;
        },
        getNbTexts : function() {
            return currentTextList !== undefined ? currentTextList.length : 0;
        },
        hasTexts : function() {
            return o.getNbTexts() > 0;
        },
        getCompleteTextListForIntention: function() {
            return completeTextListForIntention;
        },

        minSortOrderToGetShuffled: 25
    };

    // Ask the cache for a new list when route changes + area and intention can be read from route
    $rootScope.$watch(function() { return $stateParams; }, function(event, route) {
        areaName = $stateParams.areaName;
        intentionId = $stateParams.intentionId;

        if (areaName && intentionId) {
            // This is the text list that will be displayed
            getTextList(intentionId, areaName, true).then(function (textList) {
                currentTextList = textList;
            });
            // We also need the full text list
            getTextList(intentionId, areaName, false).then(function (textList) {
                completeTextListForIntention = textList;
            });
            // TODO : Test that it works
            // if we have a live connection, we should try to read an intention from the server and invalidate the cache if the intention is newer thant the local one
            intentionApi.one(areaName,intentionId).then(function (intention) {
                    var lastChange = intention.MostRecentTextUpdateEpoch;
                    console.log("lastChange :" + lastChange + " for " + intention.Label);

                    // Delete cache entries that are not up to date with lastChange number
                    var rawTextListkey = cacheKey(intentionId, areaName, ""); // Raw text list for an areaId + intentionId
                    cacheSvc.update(rawTextListkey, lastChange);
                    var textListWithOptionsKey = cacheKey(intentionId, areaName, TextFilters.valuesToWatch()); // Text list with current sorting and filtering options
                    cacheSvc.update(textListWithOptionsKey, lastChange);
                }
            );
        }
    }, true);

    // Ask the cache for a new list when filtering option change
    $rootScope.$watch(TextFilters.valuesToWatch,
        function() {
            var areaName = SelectedArea.getSelectedAreaName();
            var intentionId = SelectedIntention.getSelectedIntentionId();

            if( areaName && intentionId ) {
                getTextList(intentionId, areaName,true).then(function(textList) {
                    currentTextList = textList;
                });
            }
        });


    function loadTextList(intentionId, areaName, limit) {

        limit = limit || 10000;
        var url = AppUrlSvc.urlTextsForIntention(intentionId, areaName);
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
            console.log('text response:', response.accordionStatus);
            console.log(texts.length + " texts pour l'intention " + intentionId);
            return texts;
        })
        .then(function(texts) {
                //return filterAndReorder(texts, TextFilters);
                return texts;
        }, function (response) {
            console.log(response.accordionStatus + "*");
            throw response;
        });
    }

    // This function is just used to identify the text list in the cache
    function cacheKey(intentionId, areaName, sortAndFilterOptions) {
        return 'text-list:' + intentionId + ':' + areaName + ':' + sortAndFilterOptions;
    }

    // Call this to get a promise to a list of texts for the given intention and area
    function getTextList(intentionId, areaName, filteringRequired) {

        // This key concerns the raw text list for an areaId + intentionId
        var rawTextListkey =cacheKey(intentionId, areaName, "");
        // Text list considering sorting and filtering options such as recipient gender, prefered styles, etc.
        var textListWithOptionsKey =cacheKey(intentionId, areaName, TextFilters.valuesToWatch());

        var intention = SelectedIntention.getSelectedIntention();
        var lastChange = intention !== undefined ? intention.MostRecentTextUpdateEpoch : 0;

        // We first look in the cache for the raw text , with blank sortAndFilterOptions
        return  cacheSvc.get(rawTextListkey, lastChange, function () {
            // The cache didn't have it so load it up
            return loadTextList(intentionId, areaName)
                .then(function (texts) {
                    return  $filter('GenerateHtmlFields')(texts);
                }
            );
        })
            // Then we look for a cached version of the filtered list : if it does not exist in the cache allready we just filter what we got from the previous step
            .then(function (texts) {
                if ( filteringRequired )
                    return cacheSvc.get(textListWithOptionsKey, lastChange, function () {
                        // And feed the cache with the filtered result if not allready there
                        return filterAndReorder(texts, TextFilters);
                    },true); // Skip local storage for the filtered list : only cache it in memory
                else
                    return texts;
            })
            .then(function (texts) {
                // TODO : quality control on the texts here, to look for properties that may be outdated
                // If anything wrong, delete them from cache and local storage with cacheSvc.update(rawTextListkey,-1);
                return texts;
            });
    }

    // Call this when you receive information that the text list has been updated on the server
    function textListChanged(intentionId, areaName, changeId) {
        cacheSvc.update(cacheKey(intentionId, areaName), changeId);
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
