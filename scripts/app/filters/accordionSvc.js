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

      var minSelectiveness = 0.2;

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
        var selectiveStyleList = [];
        console.log("== " + visibleStyleList);
        for (var i = 0; i < visibleStyleList.length; i++) {
          var style = visibleStyleList[i];
          var styleCount = textsSvc.getTextCountForTagId(style.id);
          style.selectiveness  = HelperSvc.countTagSelelectiveness(style.id,styleCount,textsSvc.getLengthForTextCount());
          if ( style.selectiveness >=  minSelectiveness)
            selectiveStyleList.push(style);
          console.log(style.name + " -- " + styleCount + " -- " + style.selectiveness);
        }
        // Make a list with most selective styles first
        selectiveStyleList.sort(function (style1, style2) {
          return  style2.selectiveness - style1.selectiveness;
        });
        mostSelectiveStyles = selectiveStyleList;
      },
      isStyleVisible: function(styleName) {
        if ( !mostSelectiveStyles )
          return false;

        // A style question is visible if it is selective enough
        for (var i = 0; i < mostSelectiveStyles.length; i++) {
          var style = mostSelectiveStyles[i];
          if ( style.name == styleName && style.selectiveness >= minSelectiveness )
            return true;
        }
        return false;
      },


      addStyleToPreferred: function (styleName) {
        var  style = generalStyles.stylesByName[styleName];
        filtersSvc.filters.excludedStyles.removeStyle(style);
        filtersSvc.filters.preferredStyles.addStyle(style);
      },
      excludeStyle: function (styleName) {
        var style = generalStyles.stylesByName[styleName];
        filtersSvc.filters.preferredStyles.removeStyle(style);
        filtersSvc.filters.excludedStyles.addStyle(style);
      },
      dontUseStyleInFilters: function (styleName) {
        var style = generalStyles.stylesByName[styleName];
        filtersSvc.filters.excludedStyles.removeStyle(style);
        filtersSvc.filters.preferredStyles.removeStyle(style);
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
            service.dontUseStyleInFilters(styleName);
            break;
          default:
            console.log(choice + ' is not a valid choice !!!!!');
            break;
        }
      },
      hasStyleChoice: function(styleName,choice) {
        switch(choice) {
          case 'yes':
            return  filtersSvc.filters.preferredStyles.stylesByName[styleName] !== undefined;
            break;
          case 'no':
            return  filtersSvc.filters.excludedStyles.stylesByName[styleName] !== undefined;
            break;
          case 'maybe':
            return  !filtersSvc.filters.preferredStyles.stylesByName[styleName] && !filtersSvc.filters.excludedStyles.stylesByName[styleName];
            break;
          default:
            console.log(choice + ' is not a valid choice !!!!!');
            break;
        }
      }
    };
    service.theAccordionStatus.open = false;

    return service;
  }]);