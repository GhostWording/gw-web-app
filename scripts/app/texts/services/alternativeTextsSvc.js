angular.module('app/texts/alternativeTextList', [
  'common/services/cache',
  'common/services/server',
  'common/services/HelperSvc',
  'app/filters/filtersSvc'
])

.factory('CultureCollection', function() {
  function CultureCollection() {
    this.culturesList = [];
    this.culturesByName = {};
  }
  CultureCollection.prototype.addCulture = function(style) {
    this.culturesList.push(style);
    this.culturesByName[style.name] = style;
  };
  CultureCollection.prototype.clear = function() {
    this.culturesList.length = 0;
    this.culturesByName = {};
  };
  return CultureCollection;
})


.factory('alternativeTextsSvc', ['cacheSvc', 'serverSvc','HelperSvc','currentLanguage','CultureCollection','availableLanguages','filtersSvc','currentUser',
  function( cacheSvc, serverSvc,HelperSvc,currentLanguage,CultureCollection,availableLanguages,filtersSvc,currentUser) {
    var service = {
      // Get alternative realisations (=equivalent texts given a prototype id), for alternative languages, polite forms, sender, or recipient
      getRealizationList: function(areaName,textPrototypeId) {
        var path = areaName + '/text/realizations/' + textPrototypeId;
//        console.log("getRealizationList called for area : " + areaName + ", ProtytypeId : " + textPrototypeId);
        // TODO : think about caching when we have a cache invalidation policy
        return serverSvc.get(path,null,null,'fr-FR');
      },
      // cultures that appear at least once in a text list;
      getCultures: function(textList) {
        var availableCultures = new CultureCollection();
        for ( var i = 0; i < textList.length; i++) {
          var text = textList[i];
          var culture = text.Culture;
          if ( !availableCultures.culturesByName[culture] ) {
            availableCultures.addCulture(culture);
          }
        }
        return availableCultures;
      },
      // selects texts in a givent language from a text list
      getTextsForLanguage: function(textList,languageCodeForTextGroup) {
        var texts = [];
        for ( var i = 0; i < textList.length; i++) {
          var text = textList[i];
          var textLanguageCode = currentLanguage.getLanguageFromCulture(text.Culture);
          //if ( languageCode == targetCode) { // TODO : put this back
          if ( textLanguageCode == languageCodeForTextGroup ||  ( textLanguageCode == 'sp' && languageCodeForTextGroup == 'es'  ) ) {   // HACK around server bug
            texts.push(text);
          }
        }
        return texts;
      },

      // Calculate higher scores for texts for which sender gender, recipient gender and polite form give the best match
      countSimilarityPoints: function(nativeText, textToTest) {
        var retval = 0;
        //// Give points for matching sender gender
        if ( textToTest.Sender == nativeText.Sender )
          retval += 2; // if Sender gender match exactly, give bonus points
        if ( filtersSvc.genderCompatible(textToTest.Sender, nativeText.Sender) )
          retval += 1; // give bonus points if they are compatible
        // If defined, current user may  carry a more precise indication for the sender gender than the original text
        if ( currentUser && currentUser.gender) {
          if ( textToTest.Sender == currentUser.gender )
            retval += 2;
          if ( filtersSvc.genderCompatible(textToTest.Sender, currentUser.gender) )
            retval += 1;
        }

        //// Give points for matching recipient gender
        if ( textToTest.Target == nativeText.Target )
          retval += 2; // if Sender gender match exactly, give bonus points
        if ( filtersSvc.genderCompatible(textToTest.Target, nativeText.Target) )
          retval += 1; // give bonus points if they are compatible
        // If defined current TextFilters may carry extra indications for the recipient Gender
        var filters = filtersSvc.getFilters();
        if (filters && filters.recipientGender !== null) {
          if ( textToTest.Target == filters.recipientGender )
            retval += 2; // if Sender gender match exactly, give bonus points
          if ( filtersSvc.genderCompatible(textToTest.Target, filters.recipientGender) )
            retval += 1; // give bonus points if they are compatible
        }

        //// Give points for matching polite form (Tu ou Vous)
        if ( textToTest.PoliteForm == nativeText.PoliteForm )
          retval += 2; // if Sender gender match exactly, give bonus points
        if ( filtersSvc.tuOuVousCompatible(textToTest.PoliteForm, nativeText.PoliteForm) )
          retval += 1; // give bonus points if they are compatible
        // If defined current TextFilters may carry extra indications for the polite verbal form
        if (filters && filters.tuOuVous !== null) {
          if ( textToTest.PoliteForm == filters.tuOuVous )
            retval += 2; // if Sender gender match exactly, give bonus points
          if ( filtersSvc.tuOuVousCompatible(textToTest.PoliteForm, filters.tuOuVous) )
            retval += 1; // give bonus points if they are compatible
        }
        return retval;
      },

      textListHasTextWithSameContent : function(textList,newText) {
        for (var i = 0; i < textList.length; i++ ) {
          if ( textList[i].Content == newText.Content )
            return true;
        }
        return false;
      },

      // TODO : should return text that match the most feature
      findBestMatches: function(nativeText,textList) {
        var nbPropertyMatched = [];
        var textsWithScore = [];

        //console.log(nativeText.Content);
        var bestScoreSoFar = -100;
        for (var i = 0; i < textList.length; i++) {
          var text = textList[i];
          text.shortContent = text.Content; // hack for cvd-text
          nbPropertyMatched[i] = service.countSimilarityPoints(nativeText,text);
          //console.log(nbPropertyMatched[i] + " points for " + text.Content);
          if ( nbPropertyMatched[i] > bestScoreSoFar ) {
            bestScoreSoFar = nbPropertyMatched[i];
          }
          textsWithScore.push({"text":text,"score": nbPropertyMatched[i]});
        }
        // TODO : select all texts that match the best score
        var retval = [];
        for ( i = 0; i < textsWithScore.length; i++ ) {
          if (textsWithScore[i].score == bestScoreSoFar ) {
            // If some text content are exactly the same, only keep one
            if ( !service.textListHasTextWithSameContent(retval,textsWithScore[i].text) )
              retval.push(textsWithScore[i].text);
          }
        }
        //console.log(retval);
        return retval;
      },
      // creates an array where each entry points to a text list in a language
      getAlternativeTexts: function(text, textList,originalLanguageCode) {
        //console.log("Nb alternative realizations : " + textList.length);
        var applicationLanguages =  availableLanguages.orderedAppLanguages(originalLanguageCode);
        // For each alternative language, get gather texts related to the same prototype
        var excludeCurrentLanguage = true;
        var textArraysForLanguages = [];
        for (var i = 0; i < applicationLanguages.length; i++ ) {
          var languageCode = applicationLanguages[i];
          var textsForThisLanguage =  service.getTextsForLanguage(textList,languageCode);
          //console.log(textsForThisLanguage.length + " texts for " + languageCode + " vs original " + originalLanguageCode);
          if ( excludeCurrentLanguage && languageCode == originalLanguageCode )
            continue;
          if ( textsForThisLanguage.length > 0) {
            // If several texts exist for a language, choose the best ones
            var filteredList = service.findBestMatches(text,textsForThisLanguage);
            textArraysForLanguages.push( { "code": languageCode, "texts" : filteredList    } );
          }
        }
        return textArraysForLanguages;
      },
      isTVMorePreciseInVariation: function (original, variation) {
        return variation.PoliteForm != original.PoliteForm && variation.PoliteForm != 'I';
      },
      isSenderMorePreciseInVariation: function (original, variation) {
        return variation.Sender != original.Sender && variation.Sender != 'I' && variation.Sender != 'N';
      },
      isRecipientMorePreciseInVariation: function (original, variation) {
        return variation.Target != original.Target && variation.Target != 'I' && variation.Target != 'N';
      },

      isVariationFormMorePrecise: function (original, variation) {
        return service.isTVMorePreciseInVariation(original, variation) || service.isSenderMorePreciseInVariation(original, variation) || service.isRecipientMorePreciseInVariation(original, variation);
      },

      getSenderGenderVariationFromCurrentUser: function (variation) {
        var retval="";
//        if (variation.Sender != currentUser.gender && variation.Sender != 'I' && variation.Sender != 'N' ) {
          if (variation.Sender != 'I' && variation.Sender != 'N' ) {
          retval = variation.Sender;
        }
        return retval;
      },
      getRecipientGenderVariationFromOriginal: function (original,variation) {
        var retval="";
        if (variation.Target != original.Target && variation.Target != 'I' && variation.Target != 'N') {
          switch(variation.Target) {
            case "H" :
              retval = "à un homme";
              break;
            case "F" :
              retval = "à une femme";
              break;
            case "P" :
              retval = "à plusieurs personnes";
              break;
          }
        }
        return retval;
      },

      getGenderString: function(gender) {
        var retval;
        switch(gender) {
          case "H" :
            retval = "un homme";
            break;
          case "F" :
            retval = "une femme";
            break;
          case "I" :
            retval = "une personne";
            break;
        }
        return retval;
      }

    };
    return service;
  }]);