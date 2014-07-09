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
    // TODO : same thing with recipient tags, but just take the most likely ones
    calculateMostSelectiveStyles: function() {
      // Add a selectiveness property to the styles, relative to the current filtered text list
      var visibleStyleList = service.getVisibleStyles().stylesList;
      console.log("== " + visibleStyleList);
      for (var i = 0; i < visibleStyleList.length; i++) {
        var style = visibleStyleList[i];
        var styleCount = filteredTextListSvc.getTextCountForTagId(style.id);
        style.selectiveness  = HelperSvc.countTagSelelectiveness(style.id,styleCount,filteredTextListSvc.getLength());
        console.log(style.name + " -- " + style.selectiveness);
      }
      // Make a list with most selective styles first
      visibleStyleList.sort(function (style1, style2) {
        return  style2.selectiveness - style1.selectiveness;
      });
      mostSelectiveStyles = visibleStyleList;
    },
    isStyleVisible: function(styleName) {
      // Do not show style if we have other questions
      if ( service.askForUserGender() || service.askForRecipientGender() || service.askForTuOuVous() )
        return false;

      if ( !mostSelectiveStyles )
        return false;

      // A style question is visible if its the most selective and if it has not been asked
      var firstImportantStyleQuestionNotAsked;
      for (var i = 0; i < mostSelectiveStyles.length; i++) {
        var style = mostSelectiveStyles[i];
        if ( !service.hasStyleChoice(style.name,'maybe'))
          continue;
       if ( !questionsAsked[style.name] ) {
         if ( style.selectiveness >= minSelectiveness ) {
           firstImportantStyleQuestionNotAsked = style;
           break;
         }
       }
      }
      return firstImportantStyleQuestionNotAsked && firstImportantStyleQuestionNotAsked.name == styleName;
    },
    hasStyleChoice: function(styleName,choice) {
      return filtersSvc.hasStyleChoice(styleName,choice);
    },

    hasMoreQuestions: function() {
      if ( filteredTextListSvc.getLength() < minNbTextToAskQuestions )
        return false;

      // Do not show style if we have other questions
      if ( service.askForUserGender() || service.askForRecipientGender() || service.askForTuOuVous() )
        return true;
      if ( !mostSelectiveStyles )
        return false;

      // A style question is visible if its the most selective and if it has not been asked
      var firstImportantStyleQuestionNotAsked;
      for (var i = 0; i < mostSelectiveStyles.length; i++) {
        var style = mostSelectiveStyles[i];
        if ( !service.hasStyleChoice(style.name,'maybe'))
          continue;
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
    askForProximity: function() {
      var valret = !service.askForUserGender() && !service.askForRecipientGender() && filters.proximity === null;
      return valret;
    },

    askForTuOuVous: function() {
      var valret = !service.askForUserGender() &&
                   !service.askForRecipientGender() &&
                   !service.askForProximity() &&
                    currentLanguageHasTVDistinction() &&
                   filters.tuOuVous === null;
      return valret;
    },

    addStyleToPreferred: function (styleName) {
      var styleToAdd = generalStyles.stylesByName[styleName];
      //console.log(styleToAdd);
      filtersSvc.filters.preferredStyles.addStyle(styleToAdd);
    },
    excludeStyle: function (styleName) {
      var styles = filtersSvc.filters.preferredStyles;
      var styleToRemove = generalStyles.stylesByName[styleName];
      filtersSvc.filters.preferredStyles.removeStyle(styleToRemove);
      filtersSvc.filters.excludedStyles.addStyle(styleToRemove);
    },


    setStyleChoice: function(styleName,choice) {
      switch(choice) {
        case 'yes':
           service.addStyleToPreferred(styleName);
           break;
        case 'no':
          service.excludeStyle(styleName);
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