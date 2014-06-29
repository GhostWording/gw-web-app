angular.module('app/filters/questionBarSvc', [
  'app/filters/filtersSvc',
  'app/users/users'
])


// This service keeps track of user choices that impact the filtering of texts
.factory('questionBarSvc', ['$rootScope', 'intentionsSvc', 'areasSvc', 'currentUser', 'currentLanguage', 'currentRecipientSvc',
function ($rootScope, intentionsSvc, areasSvc, currentUser, currentLanguage, currentRecipientSvc) {

  var service = {
    askUserGender: function() {
      return currentUser.gender === null;
    }

  };

  return service;
}]);