angular.module('app/texts/textList', [])

.factory('textsSvc', ['areasSvc', 'intentionsSvc', '$route', 'cacheSvc', 'serverSvc','HelperSvc', function(areasSvc, intentionsSvc, $route, cacheSvc, serverSvc,HelperSvc) {
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
      var path = areaName + '/intention/' + intentionId + '/texts';
      return cacheSvc.get(path, -1, function() {
        //return serverSvc.get(path);
        return serverSvc.get(path).then(function(textListtoDebug) {
          var textList = [];
          for (var i = textListtoDebug.length-1; i >= 0; i-- ) {
            if (  !textListtoDebug[i] )
              console.log(intentionId + ' ' + i + ' ' + textListtoDebug[i]);
            else
              textList.push(textListtoDebug[i]);
          }
          // Make a short version of the content for list display
          for (var j = textList.length-1; j >= 0; j-- ) {
            var txtContent = textList[j].Content;
            var maxTextLengthForTextListRendering = 400;
            textList[j].shortContent = txtContent.length <=  maxTextLengthForTextListRendering ? txtContent : txtContent.substring(0, maxTextLengthForTextListRendering) + "...<span class='glyphicon glyphicon-hand-right'></span>";
          }
          // Sort the text (probably should be done on the server)
          textList.sort(function(text1,text2) {
            return -(text2.SortBy - text1.SortBy); //
          });
          // Keep the first texts sorted to display a few good ones but randomize the others to facilitate machine learning
          var minSortOrderToBeRandomized = 25; // if texts match this condition, we will know they have a fair/equal chance to be picked by users
          textList = HelperSvc.shuffleTextIfSortOrderNotLessThan(textList,minSortOrderToBeRandomized);
          return textList;
        });

      });
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