angular.module('app/filters/accordionSvc', [
  'app/filters/filtersSvc',
  'app/filters/styles',
  'app/users/users'
])


// This service keeps track of user choices that impact the filtering of texts
.factory('accordionSvc', ['$rootScope', 'intentionsSvc', 'areasSvc', 'currentUser', 'currentLanguage', 'currentRecipientSvc','filtersSvc','textsSvc','generalStyles','HelperSvc',
  function ($rootScope, intentionsSvc, areasSvc, currentUser, currentLanguage, currentRecipientSvc,filtersSvc,textsSvc,generalStyles,HelperSvc) {


      var filters = filtersSvc.filters;
      var mostSelectiveStyles;

      var minSelectiveness = 0.18;

      var currentLanguageHasTVDistinction = function() {
        return currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode());
      };

      var service = {

        theAccordionStatus : {},

        getStyleList: function() {
          return generalStyles.stylesList;
        },
        getVisibleStyles: function() {
          return generalStyles.filterByPropertyAndCopy('visible',true);
        },

        getMostSelectiveStyles: function() {
          return mostSelectiveStyles;
        },


      calculateMostSelectiveStyles: function() {
        // Add a selectiveness property to the styles, relative to the current filtered text list
        var visibleStyleList = service.getVisibleStyles().stylesList;
        console.log("== " + visibleStyleList);
        for (var i = 0; i < visibleStyleList.length; i++) {
          var style = visibleStyleList[i];
          var styleCount = textsSvc.getTextCountForTagId(style.id);
          style.selectiveness  = HelperSvc.countTagSelelectiveness(style.id,styleCount,textsSvc.getLengthForTextCount());
          console.log(style.name + " -- " + style.selectiveness);
        }
        // Make a list with most selective styles first
        visibleStyleList.sort(function (style1, style2) {
          return  style2.selectiveness - style1.selectiveness;
        });
        mostSelectiveStyles = visibleStyleList;
      },
      isStyleVisible: function(styleName) {
        // A style question is visible if it is selective enough
        for (var i = 0; i < mostSelectiveStyles.length; i++) {
          var style = mostSelectiveStyles[i];
          if ( style.name == styleName && style.selectiveness >= minSelectiveness )
            return true;
        }
        return false;
      },


      addStyleToFilters: function (styleName) {
        var styleToAdd = generalStyles.stylesByName[styleName];
        filtersSvc.filters.preferredStyles.addStyle(styleToAdd);
      },
      removeStyleFromFilters: function (styleName) {
        var styles = filtersSvc.filters.preferredStyles;
        var styleToRemove = generalStyles.stylesByName[styleName];
        filtersSvc.filters.preferredStyles.removeStyle(styleToRemove);
        filtersSvc.filters.excludedStyles.addStyle(styleToRemove);
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
      }
    };
    service.theAccordionStatus.open = false;

//    $rootScope.$watch(function() { return textsSvc.getCurrentList();}, function(retval) {
//      retval.then(function(list) {
//        if ( list.length > 0)
//          service.calculateMostSelectiveStyles();
//        })
//    },true);

    return service;
  }]);