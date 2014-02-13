cherryApp.factory('intentionApi',['$http','apiUrl','currentLanguage',function($http, apiUrl, currentLanguage) {
  return {
    forArea: function(areaName) {
      return $http.get(apiUrl +  areaName +  '/intentions',
          { headers: { 'Accept-Language': currentLanguage.code } }).then(function(response) {
        console.log('Request intentions for area "' + areaName + '"; responded with ' + response.status);
        return response.data;
      });
    },
    one: function(areaName, intentionId) {
      return $http.get(apiUrl + areaName + '/intention/' + intentionId,
        { headers: { 'Accept-Language': currentLanguage.code } }).then(function(response) {
        console.log('Request intention "' + intentionId + '" for area "' + areaName + '"; responded with ' + response.status);
        return response.data;
      });
    }
  };
}]);