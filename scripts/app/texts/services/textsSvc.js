angular.module('app/texts/textList', [])

.factory('textsSvc', ['areasSvc', 'intentionsSvc', '$route', 'cacheSvc', 'serverSvc','HelperSvc','currentLanguage',
function(areasSvc, intentionsSvc, $route, cacheSvc, serverSvc,HelperSvc,currentLanguage) {
  var service = {
    getCurrentList: function() {
      var areaName = areasSvc.getCurrentName();
      var intentionId = intentionsSvc.getCurrentId();
      return service.getTextList(areaName, intentionId);
    },
    getCurrentId: function() {
      return $route.current.params.textId;
    },
    getCurrent: function() {
      var areaName = areasSvc.getCurrentName();
      var intentionId = intentionsSvc.getCurrentId();
      var textId = service.getCurrentId();
      return service.getText(areaName, intentionId, textId);
    },
    getTextList: function(areaName, intentionId) {
      var regularPath = areaName + '/intention/' + intentionId + '/texts';
      var culture = currentLanguage.currentCulture();

      return cacheSvc.get(regularPath + culture, -1, function() {
        return serverSvc.get(regularPath).then(
          function(textList) {
            // HACK : the server API should return an error when we use a bad slug instead of an empty list
            if ( textList.length > 0 )
              return service.MakeSortedVersionWithShortenedTexts(textList);
            // As a workaround, we temporarily try the slug version here
            var slugPath = areaName + '/' + intentionId + '/texts';
            return serverSvc.get(slugPath).then(
              function(slugTextList) {
                return service.MakeSortedVersionWithShortenedTexts(slugTextList);  } )
          },
          function(error)    {
            var slugPath = areaName + '/' + intentionId + '/texts';
            return serverSvc.get(slugPath).then(function(slugTextList) {
              return service.MakeSortedVersionWithShortenedTexts(slugTextList);  } )
          }
        );
      });
    },
    MakeSortedVersionWithShortenedTexts: function (textListtoDebug) {
      var textList = textListtoDebug;
      // Make a short version of the content for list display
      for (var j = textList.length - 1; j >= 0; j--) {
        var txtContent = textList[j].Content;
        var maxTextLengthForTextListRendering = 400;
        textList[j].shortContent = txtContent.length <= maxTextLengthForTextListRendering ? txtContent : txtContent.substring(0, maxTextLengthForTextListRendering) + "...<span class='glyphicon glyphicon-hand-right'></span>";
      }
      // Sort the text (probably should be done on the server)
      textList.sort(function (text1, text2) {
        return -(text2.SortBy - text1.SortBy); //
      });
      // Keep the first texts sorted to display a few good ones but randomize the others to facilitate machine learning
      // var minSortOrderToBeRandomized = 25; // if texts match this condition, we will know they have a fair/equal chance to be picked by users
      var minSortOrderToBeRandomized = 35; // if texts match this condition, we will know they have a fair/equal chance to be picked by users
      textList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList, minSortOrderToBeRandomized);
      return textList;
    },

    // TODO : add another version of getText that will be used from TextDetail page, to cache text and translations


    getText: function(areaName, intentionId, textId) {

      function getTextById() {
        return service.getCurrentList()

          .then(function(textList) {
            for (var i = textList.length - 1; i >= 0; i--) {
              var text = textList[i];
              if ( text.TextId === textId ) {
                return text;
              }
            }
          })

          .then(function(text) {
            if ( text ) {
              return text;
            } else {
              return serverSvc.get(path);
            }
          });
      }

      var path = areaName + '/text/' + textId;

      return cacheSvc.get(path, -1, getTextById, true);
    },
//    // This function gets other realisations (=equivalent texts), for alternative languages, polite forms, sender, or recipient
//    getRealizationList: function(textId) {
//      console.log("getRealizationList called for : " + textId);
//    }

  };
  return service;
}]);