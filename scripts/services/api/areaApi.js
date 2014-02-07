cherryApp.factory('areaApi', function($http, apiUrl) {
  return {
    all: function() {
      return $http.get(apiUrl + 'areas',
                  { headers: { 'Accept-Language': currentLanguage.code } }).then(function(response) {
        console.log('Request for all areas; responded with ' + response.status);
        return response.data;
      });
    },
    one: function(areaName) {
      return $http.get(apiUrl + areaName,
                  { headers: { 'Accept-Language': currentLanguage.code } }).then(function(response) {
        console.log('Request for area: "' + areaName + '"; responded with ' + response.status);
        return response.data;
      });
    }
  };
});