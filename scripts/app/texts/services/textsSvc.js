angular.module('app/texts/textList', [])

.factory('textsSvc', ['areasSvc', 'intentionsSvc', '$route', 'cacheSvc', 'serverSvc', function(areasSvc, intentionsSvc, $route, cacheSvc, serverSvc) {
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
        return serverSvc.get(path).then(function(textList) {
          for (var i = textList.length-1; i >= 0; i-- ) {
            var txtContent = textList[i].Content;
            var maxTextLengthForTextListRendering = 400;
            textList[i].shortContent = txtContent.length <=  maxTextLengthForTextListRendering ? txtContent : txtContent.substring(0, maxTextLengthForTextListRendering) + "...<span class='glyphicon glyphicon-hand-right'></span>";
          }
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