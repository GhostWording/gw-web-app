angular.module('app/texts/textStackedMap', [
  'common/services/stackedMap'
])

.factory('textStackedMap',  ['stackedMap',
  function(stackedMap) {

    var textStack = stackedMap.createNew();


    var service = {
        get: function() {
         return textStack;
        }
    };

    return  service;
  }]);