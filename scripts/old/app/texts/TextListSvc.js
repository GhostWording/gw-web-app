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
        //o.filteredTexts = [];
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
    // This is a hack : will memorize texts with filtering and ordering options last used !
    o.cacheReorderedTexts = function (t, intentionId) {
        o.cachedTextArraysForIntention[intentionId] = t;
    };

        // This is it : queries the texts (or return a cached copy if available)
    // We should deal with the language of the request
    o.queryTexts = function (intentionId, areaName, doIfSuccess, doIfError, queryCompleteList, nbTexts) {
//        return;
        if (queryCompleteList || nbTexts === undefined)
            nbTexts = 10000;
        // If cached, return texts
        if (queryCompleteList && o.textsAlreadyCachedForIntention(intentionId)) {
            console.log("textArraysForAreas for intention" + intentionId + " read from cache");
            o.texts = o.cachedTextArraysForIntention[intentionId];
            o.filteredTexts = o.texts;
            doIfSuccess(o.texts);
            return;
        }
        // else reset them and query
        o.resetTexts();
        var url = AppUrlSvc.urlTextsForIntention(intentionId, areaName);
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
                var sortedAndShuffled = HelperService.shuffleTextIfSortOrderNotLessThan(texts, o.minSortOrderToGetShuffled);
                var sortedTexts = sortedAndShuffled;

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



    // Any property present in the  styleListObject will disqualify texts with a matching tag
    areExcludedStylesCompatible: function (styleListObject,text) {
        var retval = true;
        // Make a list of guids from the nmame of the tags chosen by user for exclusion
        var idsToExclude = o.getIdsOfTagsWithTrueValue(styleListObject);
        // For each tag the user wants to exclude, return false if it is present in the tags of the text
        for (var i = 0; i < idsToExclude.length; i++)
        {
            if ( isTextTaggedWithId(text,idsToExclude[i]) )
            {
                retval = false;
                break;
            }
        }
        return retval;
    },


    // If the required contextListObject contains at leat one property, the corresponding tag must be matched by the text
    areIncludedContextsCompatible: function (contextListObject,text) {
        // Make a list of guids from the nmame of the tags chosen by user for exclusion
        var idsToInclude = o.getIdsOfTagsWithTrueValue(contextListObject);
        // if no context defined, no need to match a choice
        if ( idsToInclude === undefined || idsToInclude.length === 0)
            return true;

        var retval = false;
        // If we match any tag we want to include, return true if it is present in the tags of the text
        for (var i = 0; i < idsToInclude.length; i++)
        {
            if ( isTextTaggedWithId(text,idsToInclude[i]) )
            {
                retval = true;
                break;
            }
        }
        return retval;
    },


    filterOnBasicFilters: function (inputTexts, basicFilters) {
        var out = [];

        for (var i = 0; i < inputTexts.length; i++) {
            var currentText = inputTexts[i];

            if (currentText.Target === null || currentText.Target.length === 0) {
                console.log("erreur target pour " + currentText.Content);
                continue;
            }
            if (currentText.Sender === null || currentText.Sender.length === 0) {
                console.log("erreur sender pour " + currentText.Content);
                continue;
            }
            var textSenderGender = currentText.Sender.charAt(0);
            var textRecipientGender = currentText.Target.charAt(0);
            //  console.log ( textSender + " " + textTarget + " vs " +
            if (
                // From user input on the page
                o.isSenderCompatible(basicFilters.getSenderGender(), textSenderGender) &&
                o.isRecipientCompatible(basicFilters.getRecipientGender(), textRecipientGender) &&
                o.isClosenessCompatible(basicFilters.getCloseness(), currentText.Proximity) &&
                o.isTuOrVousCompatible(basicFilters.getTuOuVous(), currentText.PoliteForm) &&
                // From user input in style dialog
                o.areExcludedStylesCompatible(basicFilters.getSylesToExclude(), currentText) &&
                o.areIncludedContextsCompatible(basicFilters.getContextsToInclude(), currentText)
                )

            out.push(currentText);
        }
        //console.log("out.length =" + out.length );
        //o.filteredTexts = out; // oups does not exist in that context
        return out;
    },

    reorderUsingPreferedFilters: function(texts,TextFilters) {
        var tagsToPrefer = TextFilters.getSylesToPrefer ();
        var idsToPrefer = o.getIdsOfTagsWithTrueValue(tagsToPrefer);
        // TODO : could do a first pass to randomize

        var useSortByIfSameNumberOfTags = false;

        texts.sort(
            function (a, b) {
                var aSortOrder = o.numberOfTagsMatchedByText(a, idsToPrefer);
                var bSortOrder = o.numberOfTagsMatchedByText(b, idsToPrefer);
                if ( useSortByIfSameNumberOfTags && aSortOrder == bSortOrder ) {
                    aSortOrder -= a.SortBy;
                    bSortOrder -= b.SortBy;
                }
                return -(aSortOrder - bSortOrder);
            });
        //filteredTexts = texts;
    }
  };


      // Returns true sender gender is compatible with text attributes
    isSenderCompatible: function (textSender) {
              // Undefined goes with everything
      return  (!textSender || !requiredSender) ||
              // Perfect match between required sender caracteristic and actual sender caracteristic always works
              (textSender === requiredSender) ||
              // If required sender is N (Neutral) = is single person, everything goes exepte P (Plural)
              (requiredSender === "N" && textSender !== "P") ||
              (textSender === "N" && requiredSender !== "P") ||
              // New, sender can always speak as a member of a group
              (textSender == "P");
    },
    

    // Returns true if recipient gender and number required by user is compatible with text attributes
    isRecipientCompatible: function (requiredRecipient, textRecipient) {
                // Undefined goes with everything
        return  (requiredRecipient == 'I' || textRecipient == 'I') ||
                // Perfect match between required recipient caracteristic and actual recipiend caracteristic always works
                (requiredRecipient == textRecipient) ||
                // If required recipient is N (Neutral) = is single person, everything goes exepte P (Plural)
                (requiredRecipient == 'N' && textRecipient != 'P') ||
                (textRecipient == 'N' && requiredRecipient != 'P');
    },

    
    // Returns true if criteria Tu ou Vous required by user is compatible with text attributes
    isTuOrVousCompatible: function (requiredTuOuVous, textTuOuVous) {
        return  (requiredTuOuVous == 'I' || textTuOuVous == 'I') ||
                (requiredTuOuVous == textTuOuVous) ||
                (requiredTuOuVous == 'V' && textTuOuVous == 'P');
    },


    // Returns true if closeness criteria required by user is compatible with text attributes
    isClosenessCompatible: function (requiredCloseness, textCloseness) {
        return  (requiredCloseness == 'I' || textCloseness == 'I') ||
                (requiredCloseness == textCloseness);
    }