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
      var culture = currentLanguage.currentCulture();
      var regularPath = areaName + '/intention/' + intentionId + '/texts';
      var slugPath = areaName + '/' + intentionId + '/texts';

//      var firstPath = regularPath;
//      var secondPath = slugPath;

      var firstPath = slugPath;  // Slug syntax becomes our prefered one
      var secondPath = regularPath;


      return cacheSvc.get(firstPath + culture, -1, function() {
        return serverSvc.get(firstPath).then(
          function(textList) {
            // HACK : the server API should return an error when we use a bad slug instead of an empty list
            if ( textList.length > 0 )
              return service.MakeSortedVersionWithShortenedTexts(textList);
            // As a workaround, we temporarily try the slug version here : should not be used anymore
            return serverSvc.get(secondPath).then(
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
    minSortOrderToBeRandomized : 100,

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
      //var minSortOrderToBeRandomized = 100; // if texts match this condition, we will know they have a fair/equal chance to be picked by users
      textList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList, service.minSortOrderToBeRandomized);
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