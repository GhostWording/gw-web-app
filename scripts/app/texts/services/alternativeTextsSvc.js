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
      // This function gets other realisations (=equivalent texts), for alternative languages, polite forms, sender, or recipient
      getRealizationList: function(areaName,textId) {
        // http://api.cvd.io/        GET /{areaName}/text/realizations/{realizationId}
        var path = areaName + '/text/realizations/' + textId;
        console.log("getRealizationList called for area : " + areaName + ", textId : " + textId);
        console.log("path : " +path);
        // TODO : think about caching when we have a cache invalidation policy
        return serverSvc.get(path,null,null,'fr-FR');
      },
      // Returns a collection of available cultures;
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
      getTextsForLanguage: function(textList,targetCode) {
        var texts = [];
        for ( var i = 0; i < textList.length; i++) {
          var text = textList[i];
          var languageCode = currentLanguage.getLanguageFromCulture(text.Culture);
          if ( languageCode == targetCode) {
            texts.push(text);
          }
        }
        return texts;
      },
      getAlternativeTexts: function(text, textList) {
        console.log("Nb alternative realizations : " + textList.length);
        var availableCultures = service.getCultures(textList);
        var currentLanguageCode = currentLanguage.getLanguageCode();
        var orderedPresentationLanguages =  availableLanguages.orderedAppLanguages(currentLanguageCode);
        //console.log(availableCultures);
        console.log(orderedPresentationLanguages);
        // For each alternative language, get gather texts related to the same prototype
        var excludeCurrentLanguage = true;
        var textArraysForLanguages = [];
        for (var i = 0; i < orderedPresentationLanguages.length; i++ ) {
          var code = orderedPresentationLanguages[i];
          var texts =  service.getTextsForLanguage(textList,code);
          console.log(texts.length + " texts for " + code);
          if ( excludeCurrentLanguage && code == currentLanguageCode )
            continue;
          if ( texts.length > 0) {
            // TODO : if several texts, chose try to choose the best one
            //var filteredList = findBestMatches(currentText,textList);
            textArraysForLanguages.push( { "code": code, "texts" : texts    } );
          }
        }
        // TODO : for each orderedPresentationLanguages, prepare an array of available texts for the language, then chose the best one according to sender, recipient and polite form
      }



    };
    return service;
  }]);