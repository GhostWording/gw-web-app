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
        return serverSvc.get(path);
      });
    },
    getText: function(areaName, intentionId, textId) {
      var path = areaName + '/text/' + textId;
      return cacheSvc.get(path, -1, function() {
        return serverSvc.get(path);
      });
    }
  };
  return service;
}]);