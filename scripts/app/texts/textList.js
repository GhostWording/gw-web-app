angular.module('app/texts/textList', [])

.factory('textListSvc', ['cacheSvc', 'serverSvc', function(cacheSvc, serverSvc) {
  var service = {
    getTextList: function(areaName, intentionId) {
      return cacheSvc.get('textLists.' + areaName + '.' + intentionId, -1, function() {
        return serverSvc.get(areaName + '/intention/' + intentionId + '/texts');
      });
    }
  };
  return service;
}]);