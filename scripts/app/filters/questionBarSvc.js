angular.module('app/filters/questionBarSvc', [
  'app/filters/filtersSvc',
  'app/users/users'
])


// This service keeps track of user choices that impact the filtering of texts
.factory('questionBarSvc', ['$rootScope', 'intentionsSvc', 'areasSvc', 'currentUser', 'currentLanguage', 'currentRecipientSvc','filtersSvc',
function ($rootScope, intentionsSvc, areasSvc, currentUser, currentLanguage, currentRecipientSvc,filtersSvc) {

  var filters = filtersSvc.filters;

  var currentLanguageHasTVDistinction = function() {
    return currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode());
  };

  var service = {
    askForUserGender: function() {
      return currentUser.gender === null;
    },
    askForRecipientGender: function() {
      return !service.askForUserGender() &&  filters.recipientGender === null ;
    },
    askForTuOuVous: function() {
      var valret = !service.askForUserGender() &&
                   !service.askForRecipientGender() &&
                   currentLanguageHasTVDistinction() &&
                   filters.tuOuVous === null;
      return valret;
    },


  };

  return service;
}]);