angular.module('app/filters', [])


// This service keeps track of user choices that impact the filtering of texts
.factory('filtersSvc', ['$rootScope', function($rootScope, StyleCollection) {

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