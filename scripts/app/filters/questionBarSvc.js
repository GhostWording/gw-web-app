angular.module('app/filters/questionBarSvc', [
  'app/filters/filtersSvc',
  'app/filters/styles',
  'app/users/users'
])


// This service keeps track of user choices that impact the filtering of texts
.factory('questionBarSvc', ['$rootScope', 'intentionsSvc', 'areasSvc', 'currentUser', 'currentLanguage', 'currentRecipientSvc','filtersSvc','filteredTextListSvc','generalStyles','HelperSvc',
function ($rootScope, intentionsSvc, areasSvc, currentUser, currentLanguage, currentRecipientSvc,filtersSvc,filteredTextListSvc,generalStyles,HelperSvc) {

  var filters = filtersSvc.filters;
  var mostSelectiveStyles;

  var minSelectiveness = 0.18;
  var minNbTextToAskQuestions = 8;


  var questionsAsked = {};
  function intializeQuestions()       { questionsAsked = {}; }
  function countQuestionAsAsked(name) { questionsAsked[name] = true; }
  function wasQuestionAsked(name)     { return ! questionsAsked[name] ? false : true; }

  var currentLanguageHasTVDistinction = function() {
    return currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode());
  };

  var service = {
    getStyleList: function() {
      return generalStyles.stylesList;
    },
    getVisibleStyles: function() {
      return generalStyles.filterByPropertyAndCopy('visible',true);
    },

    calculateMostSelectiveStyles: function() {
      // Add a selectiveness property to the styles, relative to the current filtered text list
      var visibleStyleList = service.getVisibleStyles().stylesList;
      console.log("== " + visibleStyleList);
      for (var i = 0; i < visibleStyleList.length; i++) {
        var style = visibleStyleList[i];
        //var selectiveness = filteredTextListSvc.countStyleSelelectiveness(style);
        var styleCount = filteredTextListSvc.getTextCountForTagId(style.id);
        style.selectiveness  = HelperSvc.countTagSelelectiveness(style.id,styleCount,filteredTextListSvc.getLength());

        console.log(style.name + " -- " + style.selectiveness);
      }
      // Make a list with most selective styles first
      visibleStyleList.sort(function (style1, style2) {
        var retval = style2.selectiveness - style1.selectiveness;
        // If texts score the same as far as styles go, use SortBy, but only if the are not meant to be randomized
        return retval;
      });
      console.log(visibleStyleList);
      mostSelectiveStyles = visibleStyleList;
      console.log(service.isStyleVisible('humorous'));
    },
    isStyleVisible: function(styleName) {

      // Do not show style if we have other questions
      if ( service.askForUserGender() || service.askForRecipientGender() || service.askForTuOuVous() )
        return false;

      // A style question is visible if its the most selective and if it has not been asked
      var firstImportantStyleQuestionNotAsked;
      for (var i = 0; i < mostSelectiveStyles.length; i++) {
        var style = mostSelectiveStyles[i];
       if ( !questionsAsked[style.name] ) {
         if ( style.selectiveness >= minSelectiveness ) {
           firstImportantStyleQuestionNotAsked = style;
           break;
         }
       }
      }
      return firstImportantStyleQuestionNotAsked && firstImportantStyleQuestionNotAsked.name == styleName;
    },

    hasMoreQuestions: function() {
      if ( filteredTextListSvc.getLength() < minNbTextToAskQuestions )
        return false;

      // Do not show style if we have other questions
      if ( service.askForUserGender() || service.askForRecipientGender() || service.askForTuOuVous() )
        return true;

      // A style question is visible if its the most selective and if it has not been asked
      var firstImportantStyleQuestionNotAsked;
      for (var i = 0; i < mostSelectiveStyles.length; i++) {
        var style = mostSelectiveStyles[i];
        if ( !questionsAsked[style.name] ) {
          if ( style.selectiveness >= minSelectiveness ) {
            firstImportantStyleQuestionNotAsked = style;
            break;
          }
        }
      }
      return firstImportantStyleQuestionNotAsked !== undefined;
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

//    askForThisStyle: function(styleName) {
//
//      // if we have less than 8 texts to read, we are done
//      if ( filteredTextListSvc.getLength() < minNbTextToAskQuestions )
//        return false;
//
//      // Check that questions with higher priority have been asked
//      if ( service.askForUserGender() || service.askForRecipientGender() || service.askForTuOuVous() )
//        return false;
//      switch  (styleName) {
//        case 'humorous':
//          if ( wasQuestionAsked('humorous') === true)
//            return false;
//          break;
//        case 'poetic':
//          if (wasQuestionAsked('humorous') === false)
//            return false;
//          break;
//        case 'imaginative':
//          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false )
//            return false;
//         break;
//        case 'warm':
//          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false || wasQuestionAsked('imaginative') === false )
//            return false;
//          break;
//        case 'citation':
//          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false ||
//              wasQuestionAsked('imaginative') === false || wasQuestionAsked('warm') === false    )
//            return false;
//          break;
//        case 'colloquial':
//          if (wasQuestionAsked('humorous') === false || wasQuestionAsked('poetic') === false ||
//          wasQuestionAsked('imaginative') === false || wasQuestionAsked('warm') === false || wasQuestionAsked('citation') === false    )
//            return false;
//          break;
//        default:
//          console.log(styleName + " UNKNONW");
//          break;
//      }
//      // Check that the question itself has not alread been asked
//      if ( wasQuestionAsked(styleName) )
//        return false;
//
//      // Will the question help eliminate some of the remaining texts in filteredTextList ?
//      var selectiveness = filteredTextListSvc.countStyleSelelectiveness(styleName);
//      console.log(styleName + ' selectiveness : ' + filteredTextListSvc.countStyleSelelectiveness(styleName));
//      var questionWorthAsking = selectiveness >= 0.18;
//
//      // If question not worth asking, make way for other questions
//      if ( !questionWorthAsking )
//        countQuestionAsAsked(styleName);
//
//      return questionWorthAsking;
//    },
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

  $rootScope.$watch(function() { return filteredTextListSvc.getLength();}, function(nbTexts) {
    if ( nbTexts > 0)
     service.calculateMostSelectiveStyles();
  },true);

  return service;
}]);