angular.module('app/filters/questionBarSvc', [
  'app/filters/filtersSvc',
  'app/users/users'
])


// This service keeps track of user choices that impact the filtering of texts
.factory('questionBarSvc', ['$rootScope', 'intentionsSvc', 'areasSvc', 'currentUser', 'currentLanguage', 'currentRecipientSvc','filtersSvc','filteredTextListSvc','generalStyles',
function ($rootScope, intentionsSvc, areasSvc, currentUser, currentLanguage, currentRecipientSvc,filtersSvc,filteredTextListSvc,generalStyles) {

  var filters = filtersSvc.filters;

  var questionsAsked = false;

  function intializeQuestions() {
    questionsAsked = false;
  }


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

    addStyleToFilters: function (styleName) {
      var styleToAdd = generalStyles.stylesByName[styleName];
      //console.log(styleToAdd);
      filtersSvc.filters.preferredStyles.addStyle(styleToAdd);
    },
    removeStyleFromFilters: function (styleName) {
      var styles = filtersSvc.filters.preferredStyles;
      var styleToRemove = generalStyles.stylesByName[styleName];
      //console.log(styleToAdd);
      filtersSvc.filters.preferredStyles.removeStyle(styleToRemove);

      filtersSvc.filters.excludedStyles.addStyle(styleToRemove);
    },
    askForHumour: function() {
      if ( service.askForUserGender() || service.askForRecipientGender() || service.askForTuOuVous() )
        return false;

      if ( questionsAsked )
        return false;

      console.log('humorous selectiveness : ' + filteredTextListSvc.countStyleSelelectiveness('humorous'));
      var selectiveness = filteredTextListSvc.countStyleSelelectiveness('humorous');

      return selectiveness >= 0.25;
    },

    setStyleChoice: function(styleName,choice) {
      switch(choice) {
        case 'yes':
           service.addStyleToFilters(styleName);
           break;
        case 'no':
          service.removeStyleFromFilters(styleName);
          break;
        case 'maybe':
          // TODO : create asked question array that is reinitialised when current intention changes
          break;
        default:
          console.log(choice + ' is not a valid choice !!!!!');
          break;
      }
      questionsAsked = true;
    }

  };
  $rootScope.$watch(function() { return intentionsSvc.getCurrentId(); }, function(intentionId) {
    if ( intentionId )
      intializeQuestions();
  }, true);


  return service;
}]);