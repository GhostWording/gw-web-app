angular.module('app/texts/textList', [])

.factory('textsSvc', ['areasSvc', 'intentionsSvc', '$stateChange', 'cacheSvc', 'serverSvc','HelperSvc','currentLanguage','minSortOrderToBeRandomized',
function(areasSvc, intentionsSvc, $stateChange, cacheSvc, serverSvc,HelperSvc,currentLanguage,minSortOrderToBeRandomized) {
  var service = {
    getCurrentList: function() {
      var areaName = areasSvc.getCurrentName();
      var intentionId = intentionsSvc.getCurrentId();
      return service.getTextList(areaName, intentionId);
    },
    getCurrentId: function() {
      return $stateChange.toParams.textId;
    },
    getCurrent: function() {
      var areaName = areasSvc.getCurrentName();
      var intentionId = intentionsSvc.getCurrentId();
      var textId = service.getCurrentId();
      return service.getText(areaName, intentionId, textId);
    },

    getTextList: function(areaName, intentionIdOrSlug,skipTracker) {

      var regularPath = areaName + '/intention/' + intentionIdOrSlug + '/texts';
      var slugPath = areaName + '/' + intentionIdOrSlug + '/texts';

      var culture = currentLanguage.currentCulture();

      var firstPath = slugPath;  // Slug syntax becomes our prefered one
      var secondPath = regularPath;

      return cacheSvc.get(cacheSvc.makeTextListCacheKey(areaName, intentionIdOrSlug,culture), -1, function() {
        return serverSvc.get(firstPath,null,skipTracker,culture).then(
          function(textList) {
            // HACK : the server API should return an error when we use a bad slug instead of an empty list
            if ( textList.length > 0 )
              return service.MakeSortedVersionWithShortenedTexts(textList);
            // Do the same thing as with the error case
            return serverSvc.get(secondPath,null,null,culture).then(
              function(slugTextList) {
                console.log(firstPath + " returned 0 texts");
                return service.MakeSortedVersionWithShortenedTexts(slugTextList);  } );
          },
          function(error)    {
            return serverSvc.get(secondPath).then(function(slugTextList) {
              return service.MakeSortedVersionWithShortenedTexts(slugTextList);  } );
          }
        );
      });
    },
    //minSortOrderToBeRandomized : 100,

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
//      textList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList, service.minSortOrderToBeRandomized);
      textList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList, minSortOrderToBeRandomized);
      return textList;
    },

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
    }

  };
  return service;
}]);