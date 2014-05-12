angular.module('app/texts/alternativeTextList', [])

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

  CultureCollection.prototype.filterCultures = function(cultureCollection) {
    var that = this;
    var filteredCultures = new CultureCollection();
    angular.forEach(cultureCollection, function(name) {
      var culture = that.culturesByName[name];
      if ( culture ) {
        filteredCultures.addCulture(culture);
      }
    });
    return filteredCultures;
  };
  return CultureCollection;
})


.factory('alternativeTextsSvc', ['cacheSvc', 'serverSvc','HelperSvc','currentLanguage','CultureCollection','availableLanguages',
  function( cacheSvc, serverSvc,HelperSvc,currentLanguage,CultureCollection,availableLanguages) {
    var service = {
      // Get alternative realisations (=equivalent texts given a prototype id), for alternative languages, polite forms, sender, or recipient
      getRealizationList: function(areaName,textPrototypeId) {
        // http://api.cvd.io/        GET /{areaName}/text/realizations/{realizationId}
        var path = areaName + '/text/realizations/' + textPrototypeId;
//        console.log("getRealizationList called for area : " + areaName + ", ProtytypeId : " + textPrototypeId);
//        console.log("path : " +path);
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
      findBestMatches: function(currentText,textList) {
        return textList;
      },
      // creates an array where each entry points to a text list in a language
      getAlternativeTexts: function(text, textList) {
        console.log("Nb alternative realizations : " + textList.length);
        //var availableCultures = service.getCultures(textList);
        var currentLanguageCode = currentLanguage.getLanguageCode();
        var applicationLanguages =  availableLanguages.orderedAppLanguages(currentLanguageCode);
        //console.log(availableCultures);
        //console.log(applicationLanguages);
        // For each alternative language, get gather texts related to the same prototype
        var excludeCurrentLanguage = true;
        var textArraysForLanguages = [];
        for (var i = 0; i < applicationLanguages.length; i++ ) {
          var languageCode = applicationLanguages[i];
          var texts =  service.getTextsForLanguage(textList,languageCode);
          console.log(texts.length + " texts for " + languageCode);
          if ( excludeCurrentLanguage && languageCode == currentLanguageCode )
            continue;
          if ( texts.length > 0) {
            // TODO : if several texts, chose try to choose the best one
            var filteredList = service.findBestMatches(currentText,textList);
            textArraysForLanguages.push( { "code": languageCode, "texts" : texts    } );
          }
        }
        // TODO : for each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best one according to sender, recipient and polite form
      }



    };
    return service;
  }]);