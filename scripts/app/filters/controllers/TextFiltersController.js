angular.module('app/filters/TextFiltersController', [])

.factory('FILTER_LABELS', function() {

  return {
    GENDER_LABEL: {
      'H': 'Homme',
      'F': 'Femme',
      null: '...'
    },

    GENDER_ICON: {
      'H': 'maleuser32.png',
      'F': 'femaleuser32.png',
      'P': 'several32.png',
      null: 'maleuser32.png'
    },

    RECIPIENT_GENDER_LABEL: {
      'H' : 'Un',
      'F' : 'Une',
      'P' : 'Plusieurs',
      null : '...'
    },

    CLOSENESS_LABEL: {
      'P': { 'P': 'proches', 'M': 'proche', 'F': 'proche', null: 'proche' },
      'D': { 'P': 'pas proches', 'M': 'pas proche', 'F': 'pas proche', null: 'pas proche' },
      null: { 'P': '...', 'M': '...', 'F': '...', null: '...' }
    },

    TUOUVOUS_LABEL: {
      'T': 'Dire tu',
      'V': 'Dire vous'
    }

  };

})

.controller('TextFiltersController', ['$scope','filtersSvc','currentUser', 'FILTER_LABELS','currentRecipientSvc', function ($scope,filtersSvc,currentUser, FILTER_LABELS,currentRecipientSvc) {
  var filters = $scope.filters = filtersSvc.filters;
  $scope.currentUser = currentUser;

  var INVERT_GENDER_MAP = {
    'H': 'F',
    'F': 'H'
  };

  // TODO: This really should be data driven - i.e. the best filter set should be a field on the intention
  // Start by setting default filter values for the area and intention
  setBestFilterDefaultValues($scope.currentArea.Name , $scope.currentIntention.IntentionId, currentUser.gender);

  // Then override with current recipient properties if available
  currentRecipientSvc.getCurrentRecipient().then(function(currentRecipient) {
    if (currentRecipient ) {
      filtersSvc.setFiltersForRecipient(currentRecipient);
      filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeId);
    }
  });

  $scope.resetRecipientGender = function() {
    filters.recipientGender = null;
  };

  $scope.recipientGenderIsDefined = function() {
    return filters.recipientGender !== null;
  };

  $scope.showBreadcrumbs = function () {
    return  !!filters.recipientGender || !!filters.tuOuVous; // When recipientGender is 'F' it will be interpreted as false !
  };

  $scope.getSenderGenderLabel = function () {
    return FILTER_LABELS.GENDER_LABEL[currentUser.gender] || 'Oups';
  };

  $scope.getSenderGenderIconName = function() {
    return FILTER_LABELS.GENDER_ICON[currentUser.gender] || 'Oups';
  };

  $scope.getRecipientGenderLabel = function () {
    return FILTER_LABELS.RECIPIENT_GENDER_LABEL[filters.recipientGender] || 'Oups';
  };

  $scope.getRecipientGenderIconName = function () {
    return FILTER_LABELS.GENDER_ICON[filters.recipientGender] || 'Oups';
  };

  $scope.getClosenessLabel = function () {
    return FILTER_LABELS.CLOSENESS_LABEL[filters.closeness][filters.recipientGender] || 'Oups';
  };

  $scope.getTuOuVousLabel = function () {
    var retval = FILTER_LABELS.TUOUVOUS_LABEL[filters.tuOuVous] || 'Oups';
    return retval;
  };

  $scope.$watch(function() {return filters.recipientGender;}, function(value) {
    if (value == 'P')
      filters.tuOuVous = 'V';
    });
  


  function invertGender(gender) {
    return INVERT_GENDER_MAP[gender] || gender;
  }


  function setBestFilterDefaultValues(areaName,intentionId, userGender) {
    console.log (areaName + " - " + intentionId + ' - ' + userGender);

    var filters = filtersSvc.filters;

    if (areaName == 'General') {
      console.log(areaName + ' area => disable all default filtering');
      return;
    }

    if ( areaName == 'LoveLife' ) {
      if ( userGender == 'H' || userGender == 'F')
        filters.recipientGender = invertGender(userGender);
      // Unless intention is 'I would like to see you again' or new relationship, presume 'Tu' will be adequate
      if ( intentionId != 'BD7387' &&  intentionId != '7445BC')
        filters.tuOuVous = 'T';
    }
    if ( areaName == 'Friends' ) {
      if ( intentionId !=  'B47AE0' && intentionId !=  '938493' )
        filters.tuOuVous = 'T';
    }
    // TODO : all this should be data driven, set by the server
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
      case '8ED62C' : // Tu me manques
      case '1395B6' : // Surprends-moi
      case '5CDCF2' : // Je t'aime
      case 'BD7387' : // J'aimerais vous revoir
      case 'D78AFB' : // Je te quitte
      case 'F4566D' : // J'ai envie de toi
        if ( userGender == 'H' || userGender == 'F')
          filters.recipientGender = invertGender(userGender);
        filters.tuOuVous = 'T';
        break;
    }

  }

}]);
