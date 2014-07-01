angular.module('app/filters/questionBarSvc', [
  'app/filters/filtersSvc',
  'app/filters/styles',
  'app/users/users'
])


// This service keeps track of user choices that impact the filtering of texts
.factory('questionBarSvc', ['$rootScope', 'intentionsSvc', 'areasSvc', 'currentUser', 'currentLanguage', 'currentRecipientSvc','filtersSvc','filteredTextListSvc','generalStyles',
function ($rootScope, intentionsSvc, areasSvc, currentUser, currentLanguage, currentRecipientSvc,filtersSvc,filteredTextListSvc,generalStyles) {

  var filters = filtersSvc.filters;

  //var ...  = generalStyles.styles;

  var questionsAsked = {};
  function intializeQuestions()       { questionsAsked = {}; }
  function countQuestionAsAsked(name) { questionsAsked[name] = true; }
  function wasQuestionAsked(name)     { return ! questionsAsked[name] ? false : true; }

  var currentLanguageHasTVDistinction = function() {
    return currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode());
  };

  var service = {
    getStyles: function() {
      return generalStyles.stylesList;
    },
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
      filtersSvc.filters.preferredStyles.removeStyle(styleToRemove);
      filtersSvc.filters.excludedStyles.addStyle(styleToRemove);
    },
    askForThisStyle: function(styleName) {

      // if we have less than 8 texts to read, we are done
      if ( filteredTextListSvc.getLength() < 8 )
        return false;

      // Check that questions with higher priority have been asked
      if ( service.askForUserGender() || service.askForRecipientGender() || service.askForTuOuVous() )
        return false;
      switch  (styleName) {
        case 'poetic':
          if (wasQuestionAsked('humorous') === false)
            return false;
          break;
        case 'imaginative':
          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false )
            return false;
         break;
        case 'warm':
          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false || wasQuestionAsked('imaginative') === false )
            return false;
          break;
        case 'citation':
          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false ||
              wasQuestionAsked('imaginative') === false || wasQuestionAsked('warm') === false    )
            return false;
          break;
        case 'colloquial':
          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false ||
          wasQuestionAsked('imaginative') === false || wasQuestionAsked('warm') === false || wasQuestionAsked('citation') === false    )
            return false;
          break;
        default:
          console.log(styleName + " UNKNONW");
          break;
      }
      // Check that the question itself has not alread been asked
      if ( wasQuestionAsked(styleName) )
        return false;

      // Will the question help eliminate some of the remaining texts in filteredTextList ?
      var selectiveness = filteredTextListSvc.countStyleSelelectiveness(styleName);
      console.log(styleName + ' selectiveness : ' + filteredTextListSvc.countStyleSelelectiveness(styleName));
      var questionWorthAsking = selectiveness >= 0.18;

      // If question not worth asking, make way for other questions
      if ( !questionWorthAsking )
        countQuestionAsAsked(styleName);

      return questionWorthAsking;
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
          break;
        default:
          console.log(choice + ' is not a valid choice !!!!!');
          break;
      }
      // Question will only we asked once
      countQuestionAsAsked(styleName);
    }

  };
  $rootScope.$watch(function() { return intentionsSvc.getCurrentId(); }, function(intentionId) {
    if ( intentionId )
      intializeQuestions();
  }, true);

  return service;
}]);