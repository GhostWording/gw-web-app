angular.module('app/filters/TextFiltersController', [])

.factory('FILTER_LABELS', function() {

  return {
    GENDER_LABEL: {
      'H': 'Homme',
      'F': 'Femme',
      '' : '...'     // null: '...' : does not work with IE9
    },

    GENDER_ICON: {
      'H': 'maleuser32.png',
      'F': 'femaleuser32.png',
      'P': 'several32.png',
      '':  'maleuser32.png'
    },

    RECIPIENT_GENDER_LABEL: {
      'H' : 'Un',
      'F' : 'Une',
      'P' : 'Plusieurs',
      '' : '...'
    },

    CLOSENESS_LABEL: {
      'P': { 'P': 'proches', 'M': 'proche', 'F': 'proche', '': 'proche' },
      'D': { 'P': 'pas proches', 'M': 'pas proche', 'F': 'pas proche', '': 'pas proche' },
      '': { 'P': '...', 'M': '...', 'F': '...', '': '...' }
    },

    TUOUVOUS_LABEL: {
      'T': 'Dire tu',
      'V': 'Dire vous'
    }

  };

})

.controller('TextFiltersController', ['$scope','filtersSvc','currentUser', 'FILTER_LABELS','currentRecipientSvc','currentLanguage',
function ($scope,filtersSvc,currentUser, FILTER_LABELS,currentRecipientSvc,currentLanguage) {
  var filters = $scope.filters = filtersSvc.filters;
  $scope.currentUser = currentUser;

  $scope.currentLanguageHasTVDistinction = function() {
    return currentLanguage.usesTVDistinction(currentLanguage.getLanguageCode());
  }

  var INVERT_GENDER_MAP = {
    'H': 'F',
    'F': 'H'
  };

  // TODO: This really should be data driven - i.e. the best filter set should be a field on the intention
  // Start by setting default filter values for the area and intention // filters now watch this
//  filtersSvc.setBestFilterDefaultValues($scope.currentArea.Name , $scope.currentIntention.IntentionId, currentUser.gender);

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

}]);
