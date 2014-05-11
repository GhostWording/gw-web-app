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


.factory('alternativeTextsSvc', ['cacheSvc', 'serverSvc','HelperSvc','currentLanguage','CultureCollection',
  function( cacheSvc, serverSvc,HelperSvc,currentLanguage,CultureCollection) {
    var service = {
      // This function gets other realisations (=equivalent texts), for alternative languages, polite forms, sender, or recipient
      getRealizationList: function(areaName,textId) {
        // http://api.cvd.io/        GET /{areaName}/text/realizations/{realizationId}
        //var path = areaName + '/intention/' + intentionId + '/texts';
        var path = areaName + '/text/realizations/' + textId;
        console.log("getRealizationList called for area : " + areaName + ", textId : " + textId);
        console.log("path : " +path);
//        return serverSvc.get(path,null,null,'fr-FR').then(function(textList) {
//          console.log("Nb alternative realizations : " + textList.length);
//          return textList;
//          });
//        }
        // TODO : think about caching when we have a cache invalidation policy
        return serverSvc.get(path,null,null,'fr-FR');
      },
      // Returns a collection of available cultures;
      getCultures: function(textList) {
        var availableCultures = new CultureCollection();
        for ( var i = 0; i <= textList.length; i++) {
          var text = textList[i];
          var culture = text.Culture;
          if ( !availableCultures.culturesByName[culture] ) {
            availableCultures.addCulture(culture);
          }
        }

      }

    };
    return service;
  }]);