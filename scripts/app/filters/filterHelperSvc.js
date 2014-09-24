angular.module('app/filters/filterHelperSvc', [
  'common/filters/styles',
])

.factory('filterHelperSvc', [ 'StyleCollection',
  function( StyleCollection) {
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
        filters.ageTag = null;
        // TODO : remove switch to desactivate age range check
        filters.useAgeTag = false; // !!!!!!!!!!!!!!!!!!
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
          ageTag: null,
          // TODO  Temporary, while not all texts are taggued
          useAgeTag: false, // !!!!!!!!!!!!!!!!!!!
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
      matchesAge: function(text,ageTag,useAgeTag) {
        if (!ageTag)
          return true;
        if (!useAgeTag)
          return true;
        var i;
        for (i = 0; i < text.TagIds.length; i++) {
          if ( text.TagIds[i] == ageTag ) {
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
        service.matchesRecipient(text, filters.recipientTypeTag) &&
        service.matchesAge(text,filters.ageTag,filters.useAgeTag );
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
//        console.log("recipient tag set to " + recipientTypeTag);
      },
      setAgeTag: function(filters,ageTag) {
        filters.ageTag = ageTag;
        //console.log("ageTag set to " + ageTag);
      },

      // should be able to do the same with userFriends
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

  }]);
