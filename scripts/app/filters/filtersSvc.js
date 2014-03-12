angular.module('app/filters/filtersSvc', ['app/filters/styles'])


// This service keeps track of user choices that impact the filtering of texts
.factory('filtersSvc', ['$rootScope', 'StyleCollection', function($rootScope, StyleCollection) {


  var service = {
    filters: {
      recipientGender: null,                   // Gender of recipient
      closeness: null,                         // ??
      tuOuVous: null,                          // informal or formal
      excludedStyles: new StyleCollection(),   // exclude texts that have these styles
      preferredStyles: new StyleCollection(),  // move texts that have these styles to the top of the list
      contexts: new StyleCollection(),         // If not empty, only show texts that match this context
    },

    reset: function() {
      service.filters.recipientGender = null;
      service.filters.tuOuVous = null;
      service.filters.closeness = null;
      service.filters.excludedStyles.clear();
      service.filters.preferredStyles.clear();
      service.filters.contexts.clear();
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
      var i, tagId;

      // Optimization - if the text has too few tags then it obviously fails
      if ( text.TagIds.length < styleCollection.stylesList.length ) {
        return false;
      }

      for (i = 0; i < styleCollection.stylesList.length; i++) {
        if ( text.TagIds.indexOf(styleCollection.stylesList[i]) === -1 ) {
          return false;
        }
      }
      return true;
    },

    matchesNoStyles: function(text, styleCollection) {
      var i, tagId;
      for (i = 0; i < text.TagIds.length; i++) {
        if ( styleCollection.stylesById[text.TagIds[i]] ) {
          return false;
        }
      }
      return true;
    },

    // This is the main filtering function for each text
    textCompatible: function(text, sender) {
        return service.senderCompatible(text.Sender, sender.gender) &&
               service.genderCompatible(text.Target, service.filters.recipientGender) &&
               service.tuOuVousCompatible(text.PoliteForm, service.filters.tuOuVous) &&
               service.matchesNoStyles(text, service.filters.excludedStyles) &&
               service.matchesAllStyles(text, service.filters.contexts);
    },


    wellDefined: function() {
      var filters = service.filters;
      return filters.recipientGender && filters.tuOuVous;
    },

    displayFilters: function(area, intention) {
      return area.name === "Formalities";
    },

    setDefaultFilters: function(area, intention, user) {
      var filters = service.filters;

      console.log ('defaultFilter for : ' + area.name + " - " + intention.IntentionId + ' - ' + user.gender);

      if ( area.name == 'LoveLife' ) {

        if ( user.gender == 'H' ) {
          filters.recipientGender = 'F';
        }

        if ( user.gender == 'F') {
          filters.recipientGender = 'H';
        }

        // Unless intention is 'I would like to see you again' or new relationship, presume 'Tu' will be adequate
        if ( !user.gender && intentionId != 'BD7387' &&  intentionId != '7445BC' ) {
          filters.tuOuVous = 'T';
        }
      }

      if ( area.name == 'Friends' ) {
        if ( intentionId !=  'B47AE0' && intentionId !=  '938493' )
          filters.tuOuVous = 'T';
      }

      switch (intentionId ) {
        case '0ECC82' : // Exutoire
        case '0B1EA1' : // Jokes
        case 'D19840' : // Venez diner à la maison
        case '451563' : // Stop the world, I want to get off
          filters.recipientGender = 'P';
          filters.tuOuVous = 'V';
          break;
        case '016E91' : // Je pense à toi
        case 'D392C1' : // Sleep well
          if ( user.gender == 'H' ) {
            filters.recipientGender = 'F';
          }

          if ( user.gender == 'F') {
            filters.recipientGender = 'H';
          }

          if ( user.gender !== null ) {
            filters.tuOuVous = 'T';
          }
          break;
      }
    },

    setDefaultStyles: function(area, intention, user) {

      //TODO - this was copied from the old code - it needs reworking in here
      // and calling when the area or intention change
         var initializeFilterModal = function () {
            $scope.humorousPrefered = TextFilters.getStyleToPrefer('humorous');
            $scope.imaginativePrefered = TextFilters.getStyleToPrefer('imaginative');
            $scope.eccentricPrefered = TextFilters.getStyleToPrefer('eccentric');
            $scope.simplePrefered = TextFilters.getStyleToPrefer('simple');
            $scope.poeticPrefered = TextFilters.getStyleToPrefer('poetic');
            $scope.citationPrefered = TextFilters.getStyleToPrefer('citation');
        };

        var initializeContextFiltersModal = function () {
            //console.log('initializeContextFilterModal');
            var contexts = TextFilters.getContextsToInclude();
            $scope.ContextFilters.friendly = contexts.friendlyContext;
            $scope.ContextFilters.familial = contexts.familialContext;
            $scope.ContextFilters.professional = contexts.professionalContext;
            $scope.ContextFilters.administrative = contexts.administrativeContext;
            $scope.ContextFilters.couple = contexts.coupleContext;
            $scope.ContextFilters.inLove = contexts.romanticContext;
            $scope.ContextFilters.dating = contexts.datingContext;
        };
    }
  };





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

  // TODO: We want to clear the preferred styles if the intention changes - this should be done in a controller

}]);