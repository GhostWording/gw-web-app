// Get texts for a given intention, filter them and order them

cherryApp.factory('TheTexts', ["$http","$filter","AppUrlSvc","HelperService","TextFilterHelperSvc", function ($http,$filter,AppUrlSvc,HelperService,TextFilterHelperSvc) {

    var o = {};
    // all items memorized from the most recent query
    o.texts = [];
    // memorize result of last filtering or ordering operation
    o.filteredTexts = [];
    // Once a text array is fully loaded, it's stored as a property of this object
    o.textArraysForAreas = {};

    o.minSortOrderToGetShuffled = 25;

    o.getMinSortOrderToGetShuffled = function() {
        return o.minSortOrderToGetShuffled;
    };

    var shouldDisplayContextFilters = true;

//    o.contextObject = {};
    o.contextTagsUsedForCurrentTextList = [];
    var showContextTags = true;

    // Only tags used for the current text list will be suggested to the user so that he can filter it
    o.setContextFiltersVisibility = function() {
        showContextTags = false;

        var allContextTagsThatMayBeChosen = contextTagsThatCanBeChosen();
        // Pour chaque tag susceptible d'être proposé à l'utilisateur compter son nombre d'occurrences
        var tagCount = [];
        for (var i = 0; i < allContextTagsThatMayBeChosen.length; i++)
            tagCount[allContextTagsThatMayBeChosen[i]] = 0;
        // TODO for each text, increment occurence count of matching tags
        for (var j = 0; j < o.texts.length; j++) {
            for (var tagIndex = 0; tagIndex < allContextTagsThatMayBeChosen.length; tagIndex++) {
                var tag = allContextTagsThatMayBeChosen[tagIndex];
                var text = o.texts[j];
                if ( isTextTaggedWithId(text,tag) )
                    tagCount[tag]++;
            }
        }
        var isCurrentTextListEmpty = o.texts.length === 0;
        // TODO : Tags are available for user choice only if one text is concerned or current text list is empty
        o.contextTagsUsedForCurrentTextList = [];
        for (i = 0; i < allContextTagsThatMayBeChosen.length; i++) {
            if ( tagCount[allContextTagsThatMayBeChosen[i]] > 0 || isCurrentTextListEmpty ) {
//                o.contextObject.contextTagsUsedForCurrentTextList.push(allContextTagsThatMayBeChosen[i]);
                o.contextTagsUsedForCurrentTextList[allContextTagsThatMayBeChosen[i]] = true;

            }
        }

        // TODO : Context tags will be shown to user only if two of the tags have an occurence count of more than 5
        // Pour que la rubrique soit montrée : au moins deux rubriques comportant 10 textes chacune
        var minCount = 5;
        var nbTagCountedMoreThanMinCount = 0;
        for (i = 0; i < allContextTagsThatMayBeChosen.length; i++) {
            if ( tagCount[allContextTagsThatMayBeChosen[i]] >= minCount  ) {
                nbTagCountedMoreThanMinCount++;
            }
        }
        if ( nbTagCountedMoreThanMinCount >= 2 || isCurrentTextListEmpty )
            showContextTags = true;

    };

    o.shouldDisplayContextFilters = function() {
        return showContextTags;
    };

    o.hasfilteredTexts = function() {
        return o.filteredTexts.length > 0;
    };
    o.nbfilteredTexts = function() {
        return o.filteredTexts.length;
    };

    o.shouldDisplayThisContextFilter = function(filterName) {
        var valret = false;
        var tagId = TextFilterHelperSvc.convertStyleNameToGuid(filterName);
        if ( o.contextTagsUsedForCurrentTextList[tagId] !== undefined )
            valret = true;
        return valret;
    };

    o.reorderUsingPreferedFilters = function(texts,TextFilters) {
        var tagsToPrefer = TextFilters.getSylesToPrefer ();
        var idsToPrefer = TextFilterHelperSvc.getIdsOfTagsWithTrueValue(tagsToPrefer);
        // TODO : could do a first pass to randomize

        var useSortByIfSameNumberOfTags = false;

        texts.sort(
            function (a, b) {
                var aSortOrder = TextFilterHelperSvc.numberOfTagsMatchedByText(a, idsToPrefer);
                var bSortOrder = TextFilterHelperSvc.numberOfTagsMatchedByText(b, idsToPrefer);
                if ( useSortByIfSameNumberOfTags && aSortOrder == bSortOrder ) {
                    aSortOrder -= a.SortBy;
                    bSortOrder -= b.SortBy;
                }
                return -(aSortOrder - bSortOrder);
            });
        o.filteredTexts = texts;
    };

    o.filterCurrentTextList = function (basicFilters) {
        return o.filterOnBasicFilters(o.texts, basicFilters);
    };

    o.filterOnBasicFilters = function (inputTexts, basicFilters) {
        var out = [];

        //var senderGender = basicFilters.getSenderGender();
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

//      console.log ( textSender + " " + textTarget + " vs " +
//        basicFilters.genreExpediteur + " " + basicFilters.genreDestinataire + " " + i);

            //console.log (basicFilters.getCloseness() + " " + currentText.Proximity);

            if (
            // From user choice on top of list
                TextFilterHelperSvc.isSenderCompatible(basicFilters.getSenderGender(), textSenderGender) &&
                    TextFilterHelperSvc.isRecipientCompatible(basicFilters.getRecipientGender(), textRecipientGender) &&
                    TextFilterHelperSvc.isClosenessCompatible(basicFilters.getCloseness(), currentText.Proximity) &&
                    TextFilterHelperSvc.isTuOrVousCompatible(basicFilters.getTuOuVous(), currentText.PoliteForm) &&
                    // From user choice in excluded styles dialog
                    TextFilterHelperSvc.areExcludedStylesCompatible(basicFilters.getSylesToExclude(), currentText) &&
                    TextFilterHelperSvc.areIncludedContextsCompatible(basicFilters.getContextsToInclude(), currentText)
            // TODO : if includedContexts are defined, they should be matched
                )

                out.push(currentText);
        }
        //console.log("out.length =" + out.length );
        o.filteredTexts = out;

        return out;
    };

    o.textsAlreadyCachedForIntention = function (intentionId) {
        return  ( o.textArraysForAreas[intentionId] !== undefined );
    };

    o.resetTexts = function () {
        o.texts = [];
    };

    // This is it : queries the texts
    o.queryTexts = function (intentionId, areaId, doIfSuccess, doIfError, queryCompleteList, nbTexts) {
        if (queryCompleteList || nbTexts === undefined)
            nbTexts = 10000;
        // If cached, return texts
        if (queryCompleteList && o.textsAlreadyCachedForIntention(intentionId)) {
            console.log("textArraysForAreas for intention" + intentionId + " read from cache");
            o.texts = o.textArraysForAreas[intentionId];
            o.filteredTexts = o.texts;
            doIfSuccess(o.textArraysForAreas[intentionId]);
            return;
        }

        var url = AppUrlSvc.urlTextsForIntention(intentionId,areaId);
        console.log (url);
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

                if (queryCompleteList)
                    o.textArraysForAreas[intentionId] = sortedAndShuffled;
                o.texts = sortedAndShuffled;
                o.filteredTexts = sortedAndShuffled;
                doIfSuccess(sortedAndShuffled);
            })
            .error(function (data, status) {
                console.log(status + "*");
                doIfError();
            });
  };

    return o;
}]);