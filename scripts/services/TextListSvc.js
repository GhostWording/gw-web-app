// Get texts for a given intention, filter them and order them

cherryApp.factory('TheTexts', ["$http","$filter","AppUrlSvc","HelperService", function ($http,$filter,AppUrlSvc,HelperService) {

    // Returns true sender gender is compatible with text attributes
    function isSenderCompatible(requiredSender,textSender ) {
        var retval = false;
        // Undefined goes with everything
        if (  textSender == "I" || requiredSender == "I"  )
            retval = true;
        // Perfect match between required sender caracteristic and actual sender caracteristic always works
        if (  textSender == requiredSender )
            retval = true;
        // If required sender is N (Neutral) = is single person, everything goes exepte P (Plural)
        if ( requiredSender == "N" && textSender != "P")
            retval = true;
        if ( textSender == "N" && requiredSender != "P")
            retval = true;

//        if ( retval == false )
//            console.log ("requiredSender,textSender : " + requiredSender + "," + textSender);
        return retval;
    }
    // Returns true if recipient gender and number required by user is compatible with text attributes
    function isRecipientCompatible(requiredRecipient,textRecipient ) {
        var retval = false;
        // Undefined goes with everything
        if ( requiredRecipient == 'I' || textRecipient == 'I')
            retval = true;
        // Perfect match between required recipient caracteristic and actual recipiend caracteristic always works
        if (requiredRecipient == textRecipient)
            retval = true;
        // If required recipient is N (Neutral) = is single person, everything goes exepte P (Plural)
        if ( requiredRecipient == 'N' && textRecipient != 'P')
            retval = true;
        if ( textRecipient == 'N' && requiredRecipient != 'P' )
            retval = true;
//        if ( retval === true )
//            console.log ("requiredRecipient,textRecipient : " + requiredRecipient + "," + textRecipient);
        return retval;
    }
    // Returns true if criteria Tu ou Vous required by user is compatible with text attributes
    function isTuOrVousCompatible(requiredTuOuVous,textTuOuVous ) {
        var retval = false;
        if ( requiredTuOuVous == 'I' || textTuOuVous == 'I')
            retval = true;
        if (requiredTuOuVous == textTuOuVous)
            retval = true;
        if (requiredTuOuVous == 'V' && textTuOuVous == 'P' )
            retval = true;
        return retval;
    }
    // Returns true if closeness criteria required by user is compatible with text attributes
    function isClosenessCompatible(requiredCloseness,textCloseness ) {
        var retval = false;
        if ( requiredCloseness == 'I' || textCloseness == 'I')
            retval = true;
        if (requiredCloseness == textCloseness)
            retval = true;
        return retval;
    }

    // Number of tags matched by a text
    function numberOfTagsMatchedByText(text,tagIds) {
        var retval  = 0;
        for (var i = 0; i < tagIds.length; i++) {
            if ( isTextTaggedWithId(text,tagIds[i]) )
                retval++;
            if ( HelperService.isQuote(text) && tagIds[i] == convertStyleNameToGuid('citation') )
                retval++;
        }
        return retval;
    }
    // Any property present in the  styleListObject will disqualify texts with a matching tag
    function areExcludedStylesCompatible(styleListObject,text) {
        var retval = true;
        // Make a list of guids from the nmame of the tags chosen by user for exclusion
        var idsToExclude = getIdsOfTagsWithTrueValue(styleListObject);
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
    }
    // If the required contextListObject contains at leat one property, the corresponding tag must be matched by the text
    function areIncludedContextsCompatible(contextListObject,text) {
        // Make a list of guids from the nmame of the tags chosen by user for exclusion
        var idsToInclude = getIdsOfTagsWithTrueValue(contextListObject);
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
    }
    // Converts a UI property name to a GUID
    function convertStyleNameToGuid(name) {
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
    }

    function contextTagsThatCanBeChosen() {
        var visibleProperties = ['administrativeContext', 'familialContext','romanticContext','datingContext','friendlyContext','professionalContext'];

        var visibleTags = [];
        for (var i = 0; i < visibleProperties.length; i++)
            visibleTags.push(convertStyleNameToGuid(visibleProperties[i]));

        return visibleTags;
    }
    // Converts properties of the styleListObject to a list of Guids that can be matched by text tags
    function getIdsOfTagsWithTrueValue(styleListObject) {
        var idsToExclude = [];
        for (var propertyname in styleListObject) {
            // if the property exists and its value is true, push the corresponding guid in the list
            if (styleListObject[propertyname] === true) {
                var guid = convertStyleNameToGuid(propertyname);
                if (guid !== undefined)
                    idsToExclude.push(guid);
                else
                    console.log("tag id not found for " + propertyname);
            }
        }
        return idsToExclude;
    }


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
        var tagId = convertStyleNameToGuid(filterName);
        if ( o.contextTagsUsedForCurrentTextList[tagId] !== undefined )
            valret = true;
        return valret;
    };


    o.reorderUsingPreferedFilters = function(texts,TextFilters) {
        var tagsToPrefer = TextFilters.getSylesToPrefer ();
        var idsToPrefer = getIdsOfTagsWithTrueValue(tagsToPrefer);
        // TODO : could do a first pass to randomize

        var useSortByIfSameNumberOfTags = false;

        texts.sort(
            function (a, b) {
                var aSortOrder = numberOfTagsMatchedByText(a, idsToPrefer);
                var bSortOrder = numberOfTagsMatchedByText(b, idsToPrefer);
                if ( useSortByIfSameNumberOfTags && aSortOrder == bSortOrder ) {
                    aSortOrder -= a.SortBy;
                    bSortOrder -= b.SortBy;
                }
                return -(aSortOrder - bSortOrder);
            });
        o.filteredTexts = texts;
    };

    o.filterCurrentTextList = function (basicFilters) {
    return o.filterOnBasicFilters(o.texts,basicFilters);
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
                isSenderCompatible   (basicFilters.getSenderGender(),    textSenderGender) &&
        isRecipientCompatible(basicFilters.getRecipientGender(), textRecipientGender) &&
                isClosenessCompatible(basicFilters.getCloseness(),       currentText.Proximity) &&
                isTuOrVousCompatible (basicFilters.getTuOuVous(),        currentText.PoliteForm) &&
                // From user choice in excluded styles dialog
                areExcludedStylesCompatible(basicFilters.getSylesToExclude(), currentText) &&
                areIncludedContextsCompatible(basicFilters.getContextsToInclude(), currentText)
                // TODO : if includedContexts are defined, they should be matched
                )

        out.push(currentText);
    }
    //console.log("out.length =" + out.length );
        o.filteredTexts = out;

        return out;
  };

  o.textsAlreadyCachedForIntention = function(intentionId)  {
    return  ( o.textArraysForAreas[intentionId] !== undefined );
  };

  o.resetTexts = function()   {
    o.texts = [];
  };

    // This is IT : queries the texts
  o.queryTexts = function( intentionId, areaId, doIfSuccess, doIfError,queryCompleteList, nbTexts) {
    if  ( queryCompleteList || nbTexts === undefined)
      nbTexts = 10000;
    if (queryCompleteList &&  o.textsAlreadyCachedForIntention(intentionId) ) {
      console.log("textArraysForAreas for intention" + intentionId + " read from cache");
      o.texts = o.textArraysForAreas[intentionId];
            o.filteredTexts = o.texts;

            doIfSuccess(o.textArraysForAreas[intentionId]);
      return;
    }

      //var url = AppUrlSvc.getApiIntentionRoot(intentionId) + "texts.json?n=" + nbTexts;
        //var url = AppUrlSvc.getApiIntentionRoot(intentionId) + "texts";

//        var url = "http://api-cvd-dev.azurewebsites.net/DayToDay/intention/8ED62C/texts";
//        var url = "http://api-cvd-dev.azurewebsites.net/DayToDay/intention/"+intentionId+"/texts";

        var url = AppUrlSvc.urlTextsForIntention(intentionId,areaId);
        console.log (url);
    //$http.get(url)
        //$http({method: 'GET', url: url,   headers: {"Content-Type":"application/json","Accept":"application/vnd.cyrano.textspage-v1.1+json"}  } )
        $http({
            method: 'GET',
            cache:false,
            url: url,
            params:{n:nbTexts,s:0},
//            headers: {"Content-Type":"application/json","Accept":"application/vnd.cyrano.textspage-v1.1+json"}
//            headers: {"Content-Type":"application/json","Accept-Language":"fr-FR"}
              headers: {"Accept-Language":"fr-FR"}
        })
      .success(function (data, status) {
        console.log(status + "*");

//                var texts = data.Items;
                var texts = data;
                console.log(texts.length+ " texts pour l'intention " + intentionId);
                // Sort texts
        $filter('OrderBySortOrderExceptFor0')(texts);

        var shuffled =  HelperService.shuffleTextIfSortOrderNotLessThan(texts, o.minSortOrderToGetShuffled);

        if ( queryCompleteList )
          o.textArraysForAreas[intentionId] = shuffled;
        o.texts = shuffled;
                o.filteredTexts = o.texts;
        doIfSuccess(shuffled);
      })
      .error(function (data, status) {
        console.log(status + "*");
        doIfError();
      });
  };



    return o;
}]);