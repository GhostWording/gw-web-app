// Users can only see filtering options that make sense for the texts they are considering
// This service dertermines which filters make sense for the current text list
cherryApp.factory('FilterVisibilityHelperSvc', ['HelperService','TextFilterHelperSvc',function (HelperService,TextFilterHelperSvc) {
    var o = {};

    // TODO : create service to memorize context tag values
    o.contextTagsUsedForCurrentTextList = [];
    var showContextTags = true;

    // Tags will only be suggested to the user if they are used in the current text list
    o.setContextFiltersVisibility = function(allTexts) {
//        var textList = o.texts;
        var textList = allTexts;

        showContextTags = false;

        var allContextTagsThatMayBeChosen = TextFilterHelperSvc.contextTagsThatCanBeChosen();
        // count number of occurrences for each text
        var tagCount = [];
        for (var i = 0; i < allContextTagsThatMayBeChosen.length; i++)
            tagCount[allContextTagsThatMayBeChosen[i]] = 0;
        // TODO for each text, increment occurence count of matching tags
        for (var j = 0; j < textList.length; j++) {
            for (var tagIndex = 0; tagIndex < allContextTagsThatMayBeChosen.length; tagIndex++) {
                var tag = allContextTagsThatMayBeChosen[tagIndex];
                var text = textList[j];
                if ( isTextTaggedWithId(text,tag) )
                    tagCount[tag]++;
            }
        }
        var isCurrentTextListEmpty = textList.length === 0;
        // TODO : Tags are available for user choice only if one text is concerned or current text list is empty
        o.contextTagsUsedForCurrentTextList = [];
        for (i = 0; i < allContextTagsThatMayBeChosen.length; i++) {
            if ( tagCount[allContextTagsThatMayBeChosen[i]] > 0 || isCurrentTextListEmpty ) {
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
    o.shouldDisplayThisContextFilter = function(filterName) {
        var valret = false;
        var tagId = TextFilterHelperSvc.convertStyleNameToGuid(filterName);
        if ( o.contextTagsUsedForCurrentTextList[tagId] !== undefined )

            valret = true;
        return valret;
    };
    return o;
}]);


