// Those functions calculate compatibility between user choices (filters) and text properties (tags)
cherryApp.factory('TextFilterHelperSvc', ['HelperService',function (HelperService) {
    var o = {};
    // Returns true sender gender is compatible with text attributes
    o.isSenderCompatible = function (requiredSender, textSender) {
        var retval = false;
        // Undefined goes with everything
        if (textSender == "I" || requiredSender == "I")
            retval = true;
        // Perfect match between required sender caracteristic and actual sender caracteristic always works
        if (textSender == requiredSender)
            retval = true;
        // If required sender is N (Neutral) = is single person, everything goes exepte P (Plural)
        if (requiredSender == "N" && textSender != "P")
            retval = true;
        if (textSender == "N" && requiredSender != "P")
            retval = true;

//        if ( retval == false )
//            console.log ("requiredSender,textSender : " + requiredSender + "," + textSender);
        return retval;
    };
    // Returns true if recipient gender and number required by user is compatible with text attributes
    o.isRecipientCompatible = function (requiredRecipient, textRecipient) {
        var retval = false;
        // Undefined goes with everything
        if (requiredRecipient == 'I' || textRecipient == 'I')
            retval = true;
        // Perfect match between required recipient caracteristic and actual recipiend caracteristic always works
        if (requiredRecipient == textRecipient)
            retval = true;
        // If required recipient is N (Neutral) = is single person, everything goes exepte P (Plural)
        if (requiredRecipient == 'N' && textRecipient != 'P')
            retval = true;
        if (textRecipient == 'N' && requiredRecipient != 'P')
            retval = true;
//        if ( retval === true )
//            console.log ("requiredRecipient,textRecipient : " + requiredRecipient + "," + textRecipient);
        return retval;
    };
    // Returns true if criteria Tu ou Vous required by user is compatible with text attributes
    o.isTuOrVousCompatible = function (requiredTuOuVous, textTuOuVous) {
        var retval = false;
        if (requiredTuOuVous == 'I' || textTuOuVous == 'I')
            retval = true;
        if (requiredTuOuVous == textTuOuVous)
            retval = true;
        if (requiredTuOuVous == 'V' && textTuOuVous == 'P')
            retval = true;
        return retval;
    };
    // Returns true if closeness criteria required by user is compatible with text attributes
    o.isClosenessCompatible = function (requiredCloseness, textCloseness) {
        var retval = false;
        if (requiredCloseness == 'I' || textCloseness == 'I')
            retval = true;
        if (requiredCloseness == textCloseness)
            retval = true;
        return retval;
    };

    // Number of tags matched by a text
    o.numberOfTagsMatchedByText = function (text,tagIds) {
        var retval  = 0;
        for (var i = 0; i < tagIds.length; i++) {
            if ( isTextTaggedWithId(text,tagIds[i]) )
                retval++;
            if ( HelperService.isQuote(text) && tagIds[i] == o.convertStyleNameToGuid('citation') )
                retval++;
        }
        return retval;
    };
    // Any property present in the  styleListObject will disqualify texts with a matching tag
    o.areExcludedStylesCompatible =  function (styleListObject,text) {
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
    };
    // If the required contextListObject contains at leat one property, the corresponding tag must be matched by the text
    o.areIncludedContextsCompatible=function (contextListObject,text) {
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
    };
    // Converts a UI property name to a GUID
    o.convertStyleNameToGuid = function (name) {
        var retval;
        switch(name) {
            // Style tags
            case 'romantic':
                retval = 'CB38B9';
                break;
            case 'effusive':
                retval = 'C91BCD';
                break;
            case 'colloquial':
                retval = '3337EE';
                break;
            case 'racy':
                retval = '1A2DD5';
                break;
            case 'caustic':
                retval = '2968CB';
                break;
            case 'humorous':
                retval = '43AC3B';
                break;
            case 'eccentric':     // quirky //  // cranky
                retval = '57B018';
                break;
            case 'simple':       // straightforward
//                retval = '1B81A05D-066B-48B8-B35A-99101ADB9018';
                retval = 'FBC055';
                break;
//            case 'formal':
//                retval = '75190C';
//                break;
            // Fake code, anything will do except undefined
            case 'citation':
                retval = 'citationCode';
                break;
            case 'imaginative':
                retval = '8CC4E5';
                break;
            case 'friendly': // chaleureux
                retval = '5EDC19';
                break;
            case 'poetic':
                retval = '801BD9';
                break;
            case 'melancholic':
                retval = '13F241';
                break;

            // Context tags ////////////////////////////
            case 'administrativeContext':
                retval = '4A53D1';
                break;
            case 'familialContext':
                retval = '71185C';
                break;
            case 'romanticContext':
                retval = '7A55C6';
                break;
//            case 'datingContext':
//                retval = '37018A';
//                break;
//            case 'coupleContext':
//                retval = 'AD9362';
//                break;
            case 'friendlyContext':
                retval = 'E40677';
                break;
            case 'professionalContext':
                retval = '657D8E';
                break;
            // NEW !!!!!!!!!! Will use old one instead
//            case 'sentimentalContext':
//                retval = 'A6C9E6';
//                break;
        }

        return retval;
    };
    // Context tags that can be chosen by users
    o.contextTagsThatCanBeChosen= function () {
        var visibleProperties = ['administrativeContext', 'familialContext','romanticContext','datingContext','friendlyContext','professionalContext'];

        var visibleTags = [];
        for (var i = 0; i < visibleProperties.length; i++)
            visibleTags.push(o.convertStyleNameToGuid(visibleProperties[i]));

        return visibleTags;
    };
    // Converts properties of the styleListObject to a list of Guids that can be matched by text tags
    o.getIdsOfTagsWithTrueValue = function (styleListObject) {
        var idsToExclude = [];
        for (var propertyname in styleListObject) {
            // if the property exists and its value is true, push the corresponding guid in the list
            if (styleListObject[propertyname] === true) {
                var guid = o.convertStyleNameToGuid(propertyname);
                if (guid !== undefined)
                    idsToExclude.push(guid);
                else
                    console.log("tag id not found for " + propertyname);
            }
        }
        return idsToExclude;
    };

    o.filterOnBasicFilters = function (inputTexts, basicFilters) {
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
    };

    o.reorderUsingPreferedFilters = function(texts,TextFilters) {
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
    };

    return o;
}]);
