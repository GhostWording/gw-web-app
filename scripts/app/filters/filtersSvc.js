angular.module('app/filters/filtersSvc', ['app/filters/styles'])


// This service keeps track of user choices that impact the filtering of texts
.factory('filtersSvc', ['$rootScope', 'StyleCollection','intentionsSvc','areasSvc','currentUser','currentLanguage',
function($rootScope, StyleCollection,intentionsSvc,areasSvc,currentUser,currentLanguage) {


  var service = {
    filters: {
      recipientGender: null,                   // Gender of recipient
      closeness: null,                         // ??
      tuOuVous: null,                          // informal or formal
      excludedStyles: new StyleCollection(),   // exclude texts that have these styles
      preferredStyles: new StyleCollection(),  // move texts that have these styles to the top of the list
      contexts: new StyleCollection(),         // If not empty, only show texts that match this context
      recipientTypeTag : null
    },

    getFilters: function() {
      return service.filters;
    },
    reset: function() {
      service.filters.recipientGender = null;
      service.filters.tuOuVous = null;
      service.filters.closeness = null;
      service.filters.excludedStyles.clear();
      service.filters.preferredStyles.clear();
      service.filters.contexts.clear();
      service.filters.recipientTypeTag = null;
    },

    compatible: function(textValue, filterValue) {
      return !textValue || textValue == 'I' || !filterValue ||
              textValue == filterValue;
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

    matchesAllStyles: function(text, styleCollection) {
      var i;

      // Optimization - if the text has too few tags then it obviously fails
      if ( text.TagIds.length < styleCollection.stylesList.length ) {
        return false;
      }

      for (i = 0; i < styleCollection.stylesList.length; i++) {
        if ( text.TagIds.indexOf(styleCollection.stylesList[i].id) === -1 ) {
          return false;
        }
      }
      return true;
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
    textCompatible: function(text, sender) {
        return service.senderCompatible(text.Sender, sender.gender) &&
               service.genderCompatible(text.Target, service.filters.recipientGender) &&
               service.tuOuVousCompatible(text.PoliteForm, service.filters.tuOuVous) &&
               service.matchesNoStyles(text, service.filters.excludedStyles) &&
               //service.matchesAllStyles(text, service.filters.contexts); //
              (service.matchesAStyle(text, service.filters.contexts) || service.filters.contexts.stylesList.length === 0) &&
              service.matchesRecipient(text,service.filters.recipientTypeTag);
    },

    // TODO : instead of being called, we should watch for a (true) recipient change
    previousCurrentRecipient: undefined,
    setFiltersForRecipient : function(recipient) {
      var message = (!service.previousCurrentRecipient || recipient.Id != service.previousCurrentRecipient.Id) ? "different" : "same" ;
      //console.log(message + " " + recipient);
      if ( recipient && message != "same") { // second condition prevents overriding explicit user choices when recipient has not really changed
        if ( recipient.Gender )
          service.filters.recipientGender = recipient.Gender;
        if ( recipient.TuOuVous )
          service.filters.tuOuVous = recipient.TuOuVous;
      }
      service.previousCurrentRecipient = recipient;
    },
    setRecipientTypeTag: function(recipientTypeTag) {
      service.filters.recipientTypeTag = recipientTypeTag;
    },

    wellDefined: function() {
      var filters = service.filters;
      //currentLanguage
      //return filters.recipientGender && filters.tuOuVous;
      if ( !filters.recipientGender )
        return false;
      if ( currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode()) && !filters.tuOuVous)
        return false;
      return true;
    },

    displayFilters: function(area, intention) {
      return area.name === "Formalities";
    },

    // Not currently used : work is done in textFilterController instead
//    setDefaultFilters: function (area, intention, user) {
//      var filters = service.filters;
//
//      console.log('defaultFilter for : ' + area.name + " - " + intention.IntentionId + ' - ' + user.gender);
//
//      if (area.name == 'General') {
//        console.log(area.name + ' area => disable all default filtering');
//        return;
//      }
//
//      if (area.name == 'LoveLife') {
//        if (user.gender == 'H') {
//          filters.recipientGender = 'F';
//        }
//        if (user.gender == 'F') {
//          filters.recipientGender = 'H';
//        }
//        // Unless intention is 'I would like to see you again' or new relationship, presume 'Tu' will be adequate
//        if (!user.gender && intentionId != 'BD7387' && intentionId != '7445BC') {
//          filters.tuOuVous = 'T';
//        }
//      }
//
//      if (area.name == 'Friends') {
//        if (intentionId != 'B47AE0' && intentionId != '938493')
//          filters.tuOuVous = 'T';
//      }
//
//      switch (intentionId) {
//        case '0ECC82' : // Exutoire
//        case '0B1EA1' : // Jokes
//        case 'D19840' : // Venez diner à la maison
//        case '451563' : // Stop the world, I want to get off
//          filters.recipientGender = 'P';
//          filters.tuOuVous = 'V';
//          break;
//        case '016E91' : // Je pense à toi
//        case 'D392C1' : // Sleep well
//          if (user.gender == 'H') {
//            filters.recipientGender = 'F';
//          }
//          if (user.gender == 'F') {
//            filters.recipientGender = 'H';
//          }
//          if (user.gender !== null) {
//            filters.tuOuVous = 'T';
//          }
//          break;
//      }
//    }

    INVERT_GENDER_MAP : {
      'H': 'F',
      'F': 'H'
    },

    invertGender : function (gender) {
    return service.INVERT_GENDER_MAP[gender] || gender;
    },


  setBestFilterDefaultValues: function (areaName,intentionId, userGender) {
    console.log (areaName + " - " + intentionId + ' - ' + userGender);

    // When intention (trully) changes : try to guess best filter settings
    if (areaName == 'General') {
      console.log(areaName + ' area => disable all default filtering');
      return;
    }
    if ( areaName == 'LoveLife' ) {
      if ( userGender == 'H' || userGender == 'F')
        service.filters.recipientGender = service.invertGender(userGender);
      // Unless intention is 'I would like to see you again' or new relationship, presume 'Tu' will be adequate
      if ( intentionId != 'BD7387' &&  intentionId != '7445BC')
        service.filters.tuOuVous = 'T';
    }
    if ( areaName == 'Friends' ) {
      if ( intentionId !=  'B47AE0' && intentionId !=  '938493' )
        service.filters.tuOuVous = 'T';
    }

    // TODO : all this should be data driven, set by the server
    switch (intentionId ) {
      case '0ECC82' : // Exutoire
        service.filters.recipientGender = 'H';
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
      case 'BD7387' : // J'aimerais vous revoir
      case 'D78AFB' : // Je te quitte
      case 'F4566D' : // J'ai envie de toi
        if ( userGender == 'H' || userGender == 'F')
          service.filters.recipientGender = service.invertGender(userGender);
        service.filters.tuOuVous = 'T';
        break;
    }
  }

  };

  $rootScope.$watch(function() { return intentionsSvc.getCurrentId(); }, function(intentionId) {
    var areaName = areasSvc.getCurrentName();
    var userGender = currentUser.gender;
    console.log("Intention changed to " + intentionId + " on area " + areaName + " with user gender " + userGender);
    if (intentionId !== undefined && areaName !== undefined) {
      service.reset();
      service.setBestFilterDefaultValues(areaName,intentionId, userGender);
    }
  }, true);

  // Compute additional filter values
  var updateFilters = function() {
    var filters = service.filters;
    // Proche mais pas Plusieurs : Close to recipient and not several of them => Tu looks like a good choice
    if ( !filters.tuOuVous && filters.closeness === 'P' && filters.recipientGender !== 'P') {
      filters.tuOuVous = 'T';
    }
  };

  // Set up various connections between filters, using $watches
  $rootScope.$watch(function() { return service.filters; }, updateFilters, true);

  return service;
}]);