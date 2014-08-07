angular.module('app/filters/filtersSvc', [
  'app/filters/styles',
  'app/intentions',
  'app/users/currentUser'
])

.factory('filterHelperSvc', [ 'StyleCollection','currentUser','currentLanguage',
  function( StyleCollection,currentUser,currentLanguage) {
    var service = {

      // A text property is compatible with a filter if is has the same value, has value I : Indifferent, or filter is not defined
      compatible: function(textValue, filterValue) {
        return !textValue || textValue == 'I' || !filterValue ||
        textValue == filterValue ||
        filterValue == 'I' // new, 9th July
        ;
      },
      genderCompatible: function(textValue, filterValue) {
        return service.compatible(textValue, filterValue) ||
        (textValue != 'P' && filterValue == 'N') ||
        (textValue == 'N' && filterValue != 'P');
      },
      senderCompatible: function(textValue, filterValue) {
        // sender can always speak as a member of a group
        return textValue == 'P' || service.genderCompatible(textValue, filterValue);
      },
      tuOuVousCompatible: function(textValue, filterValue) {
        return service.compatible(textValue, filterValue) ||
        (textValue == 'P' && filterValue == 'V');
      },

      proximityCompatible: function(textValue, filterValue) {
        return service.compatible(textValue, filterValue);
      },
      reset: function(filters) {
        filters.recipientGender = null;
        filters.tuOuVous = null;
        filters.closeness = null;
        filters.excludedStyles.clear();
        filters.preferredStyles.clear();
        filters.contexts.clear();
        filters.recipientTypeTag = null;
        filters.proximity = null;
        console.log("filters reset");
      },

      createEmptyFilters: function () {
        var retval = {
          recipientGender: null,                   // Gender of recipient
          closeness: null,                         // ??
          tuOuVous: null,                          // informal or formal
          excludedStyles: new StyleCollection(),   // exclude texts that have these styles
          preferredStyles: new StyleCollection(),  // move texts that have these styles to the top of the list
          contexts: new StyleCollection(),         // If not empty, only show texts that match this context
          recipientTypeTag: null,
          proximity: null
        };
        return retval;
      },
      matchesAStyle: function(text, styleCollection) {
        for (var i = 0; i < styleCollection.stylesList.length; i++) {
          if ( text.TagIds.indexOf(styleCollection.stylesList[i].id) != -1 ) {
            return true;
          }
        }
        return false;
      },
      matchesNoStyles: function(text, styleCollection) {
        var i;
        for (i = 0; i < text.TagIds.length; i++) {
          if ( styleCollection.stylesById[text.TagIds[i]] ) {
            return false;
          }
        }
        return true;
      },
      matchesRecipient: function(text,recipientTypeTag) {
        if (!recipientTypeTag)
          return true;
        var i;
        for (i = 0; i < text.TagIds.length; i++) {
          if ( text.TagIds[i] == recipientTypeTag ) {
            return true;
          }
        }
        return false;
      },

      // This is the main filtering function for each text
      textCompatible: function (text, sender,filters) {
      return service.senderCompatible(text.Sender, sender.gender) &&
      service.genderCompatible(text.Target, filters.recipientGender) &&
      service.tuOuVousCompatible(text.PoliteForm, filters.tuOuVous) &&
      service.proximityCompatible(text.Proximity, filters.proximity) &&
      service.matchesNoStyles(text, filters.excludedStyles) &&
      (service.matchesAStyle(text, filters.contexts) || filters.contexts.stylesList.length === 0) &&
      service.matchesRecipient(text, filters.recipientTypeTag);
      },

      INVERT_GENDER_MAP : {
        'H': 'F',
        'F': 'H'
      },

      invertGender: function (gender) {
        return service.INVERT_GENDER_MAP[gender] || gender;
      },
      setContextTypeTag: function(filters,contextTypeStyle) {
        filters.contexts.clear();
        if ( !!contextTypeStyle )
          filters.contexts.addStyle(contextTypeStyle);
//        console.log("contexts tag set to " + contextTypeStyle);
      },
      setRecipientTypeTag: function(filters,recipientTypeTag) {
        filters.recipientTypeTag = recipientTypeTag;
        console.log("recipient tag set to " + recipientTypeTag);
      },


      //contexts
      setFilterValuesForRecipient: function (recipient,filters) {
        if (!recipient)
          return;
        if (recipient.Gender)
          filters.recipientGender = recipient.Gender;
        else
          filters.recipientGender = null;
        if (recipient.TuOuVous)
          filters.tuOuVous = recipient.TuOuVous;
        else
          filters.tuOuVous = null;

        //console.log('setFilterValuesForRecipient called for : ' + recipient);
      },

    };
    return service;

  }])


// This service keeps track of user choices that impact the filtering of texts
.factory('filtersSvc', ['$rootScope', 'StyleCollection','intentionsSvc','areasSvc','currentUser','currentLanguage','currentRecipientSvc','filterHelperSvc',
function($rootScope, StyleCollection,intentionsSvc,areasSvc,currentUser,currentLanguage,currentRecipientSvc,filterHelperSvc) {

  var service = {

    filters: filterHelperSvc.createEmptyFilters(),

    getCurrentFilters: function() {
      return service.filters;
    },

    reset: function() {
      filterHelperSvc.reset(service.filters);
    },

    // This is the main filtering function for each text
    textCompatible: function (text, sender) {
      return  filterHelperSvc.textCompatible(text, sender,service.filters);
    },

    setRecipientTypeTag: function(recipientTypeTag) {
      //service.filters.recipientTypeTag = recipientTypeTag;
      filterHelperSvc.setRecipientTypeTag(service.filters, recipientTypeTag);
    },

    wellDefined: function() {
      var filters = service.filters;
      if ( !filters.recipientGender )
        return false;
      if ( currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode()) && !filters.tuOuVous)
        return false;
      return true;
    },

//    displayFilters: function(area, intention) {
//      return area.name === "Formalities";
//    },

    canHaveSeveralRecipientsforCurrentArea: function () {
      var retval = true;
      var areaName = areasSvc.getCurrentName();
      if (areaName == 'LoveLife')
        retval = false;
      return retval;
    },

    setBestFilterDefaultValues: function (areaName, intentionId, userGender) {
//      console.log(areaName + " - " + intentionId + ' - ' + userGender);

      // When intention (trully) changes : try to guess best filter settings
      if (areaName == 'General') {
        console.log(areaName + ' area => disable all default filtering');
        return;
      }
      if (areaName == 'LoveLife') {
        if (userGender == 'H' || userGender == 'F')
          service.filters.recipientGender = filterHelperSvc.invertGender(userGender);
        // Unless intention is 'I would like to see you again' or new relationship, presume 'Tu' will be adequate
        if (intentionId != 'BD7387' && intentionId != '7445BC' && intentionId != 'j-aimerais-vous-revoir')
          service.filters.tuOuVous = 'T';
      }
      if (areaName == 'Friends') {
        if (intentionId != 'B47AE0' && intentionId != '938493')
          service.filters.tuOuVous = 'T';
      }

      // TODO : all this should be data driven, set by the server
      // TODO : We should use the slugs instead
      switch (intentionId) {
        case '0ECC82' : // Exutoire
          service.filters.recipientGender = 'N';
          service.filters.tuOuVous = 'T';
          break;
        case '0B1EA1' : // Jokes
        case 'D19840' : // Venez diner à la maison
        case '451563' : // Stop the world, I want to get off
          service.filters.recipientGender = 'P';
          service.filters.tuOuVous = 'V';
          break;
        case '016E91' : // Je pense à toi
        case 'D392C1' : // Sleep well
        case '8ED62C' : // Tu me manques
        case '1395B6' : // Surprends-moi
        case '5CDCF2' : // Je t'aime
        case 'D78AFB' : // Je te quitte
        case 'F4566D' : // J'ai envie de toi
          if (userGender == 'H' || userGender == 'F')
            service.filters.recipientGender = filterHelperSvc.invertGender(userGender);
          service.filters.tuOuVous = 'T';
          break;
        case 'BD7387' : // J'aimerais vous revoir
          if (userGender == 'H' || userGender == 'F')
            service.filters.recipientGender = filterHelperSvc.invertGender(userGender);
          service.filters.tuOuVous = null;
          break;
      }

      if (!currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode()))
        service.filters.tuOuVous = undefined;
    },

    setFilterValuesForRecipientId: function (recipientId) {
      if (!recipientId || recipientId == 'none')
        return;
      var recipient = currentRecipientSvc.getCurrentRecipientNow();
      if (!recipient)
        return;

      filterHelperSvc.setFilterValuesForRecipient(recipient,service.filters);
    },

    hasStyleChoice: function(styleName,choice) {
      switch(choice) {
        case 'yes':
          return  service.filters.preferredStyles.stylesByName[styleName] !== undefined;
        case 'no':
          return  service.filters.excludedStyles.stylesByName[styleName] !== undefined;
        case 'maybe':
          return  !service.filters.preferredStyles.stylesByName[styleName] && !service.filters.excludedStyles.stylesByName[styleName];
        default:
          console.log(choice + ' is not a valid choice !!!!!');
          break;
      }
    }

  };

  $rootScope.$watch(function() { return currentRecipientSvc.getCurrentRecipientId(); },
  function(recipientId) {
    service.setFilterValuesForRecipientId(recipientId);
  },true);


  $rootScope.$watch(function() { return intentionsSvc.getCurrentId(); },
  function(intentionId) {
    var areaName = areasSvc.getCurrentName();
    if ( areaName == "Addressee")
      return;
    var userGender = currentUser.gender;
//    console.log("Intention changed to " + intentionId + " on area " + areaName + " with user gender " + userGender);
    if (intentionId !== undefined && areaName !== undefined) {
      service.reset();
      service.setBestFilterDefaultValues(areaName,intentionId, userGender);
    }
  }, true);

  // Compute additional filter values
  var updateFilters = function() {
    var filters = service.filters;
    // Close to recipient and not several of them => Tu looks like a good choice
    if ( !filters.tuOuVous && filters.proximity === 'P' && filters.recipientGender !== 'P')
      filters.tuOuVous = 'T';
    // Not Close to recipient  => Vous looks like a good choice
    if ( !filters.tuOuVous && filters.proximity === 'D' )
      filters.tuOuVous = 'V';

    if (!currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode()))
      service.filters.tuOuVous = undefined;

  };

  // Set up various connections between filters, using $watches
  $rootScope.$watch(function() { return service.filters; }, updateFilters, true);

  return service;
}]);