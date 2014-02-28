angular.module('app/filters/TextFiltersController', [])

.controller('TextFiltersController', ['$scope','filtersSvc','currentUser', function ($scope,filtersSvc,currentUser) {
  var GENDER_LABEL = {
    'H': 'Homme',
    'F': 'Femme',
    null: '...'
  };
  var GENDER_ICON = {
    'H': 'maleuser32.png',
    'F': 'femaleuser32.png',
    'P': 'several32.png',
    null: 'maleuser32.png'
  };

  var RECIPIENT_GENDER_LABEL = {
    'H' : 'Un',
    'F' : 'Une',
    'P' : 'Plusieurs',
    null : '...'
  };

  var CLOSENESS_LABEL = {
    'P': { 'P': 'proches', 'M': 'proche', 'F': 'proche', null: 'proche' },
    'D': { 'P': 'pas proches', 'M': 'pas proche', 'F': 'pas proche', null: 'pas proche' },
    null: { 'P': '...', 'M': '...', 'F': '...', null: '...' }
  };

  var TUOUVOUS_LABEL = {
    'T': 'Dire tu',
    'V': 'Dire vous'
  };

  var INVERT_GENDER_MAP = {
    'H': 'F',
    'F': 'H'
  };

  var filters = $scope.filters = filtersSvc.filters;

  $scope.showBreadcrumbs = function () {
    return !filters.recipientGender || !filters.closeness || !filters.tuOuVous;
  };

  $scope.getSenderGenderLabel = function () {
    return GENDER_LABEL[currentUser.gender] || 'Oups';
  };

  $scope.getSenderGenderIconName = function() {
    return GENDER_ICON[currentUser.gender] || 'Oups';
  };

  $scope.getRecipientGenderLabel = function () {
    return RECIPIENT_GENDER_LABEL[filters.recipientGender] || 'Oups';
  };

  $scope.getRecipientGenderIconName = function () {
    return GENDER_ICON[currentUser.gender] || 'Oups';
  };

  $scope.getClosenessLabel = function () {
    return CLOSENESS_LABEL[filters.closeness][filters.recipientGender] || 'Oups';
  };

  $scope.getTuOuVousLabel = function () {
    return TUOUVOUS_LABEL[filters.tuOuVous] || 'Oups';
  };

  // TODO: Work this into the data
  // $scope.modifySpellingAccordingToGender = function (genre) {
  //   if (genre == 'F') {
  //     TextFilters.libelleReservee = "Réservée";
  //     TextFilters.libelleExpansive = "Expansive";
  //   }
  //   else {
  //     TextFilters.libelleReservee = "Réservé";
  //     TextFilters.libelleExpansive = "Expansif";
  //   }
  // };

  // $scope.definirGenreExpediteur = function (genre) {
  //   // TODO : call modifySpellingAccordingToGender by watching an event
  //   $scope.modifySpellingAccordingToGender(genre);
  //   TextFilters.setSenderGender(genre);
  // };
  // $scope.definirGenreDestinataire = function (genre) {
  //   TextFilters.setRecipientGender(genre);
  //   if (genre == 'P')
  //     TextFilters.setTuOuVous('V');
  // };
  
  function invertGender(gender) {
    return INVERT_GENDER_MAP[gender] || gender;
  }

  // TODO: This really should be data driven - i.e. the best filter set should be a field on the intention
  setBestFilterDefaultValues($scope.currentArea.name , $scope.currentIntention.IntentionId, currentUser.gender);

  function setBestFilterDefaultValues(areaName,intentionId, userGender) {
    console.log (areaName + " - " + intentionId + ' - ' + userGender);

    if ( areaName == 'LoveLife' ) {
      if ( userGender == 'H' || userGender == 'F')
        TextFilters.setRecipientGender(invertGender(userGender));
      // Unless intention is 'I would like to see you again' or new relationship, presume 'Tu' will be adequate
      if ( intentionId != 'BD7387' &&  intentionId != '7445BC')
        TextFilters.setTuOuVous('T');
    }
    if ( areaName == 'Friends' ) {
      if ( intentionId !=  'B47AE0' && intentionId !=  '938493' )
        TextFilters.setTuOuVous('T');
    }
    switch (intentionId ) {
      case '0ECC82' : // Exutoire
      case '0B1EA1' : // Jokes
      case 'D19840' : // Venez diner à la maison
      case '451563' : // Stop the world, I want to get off
        TextFilters.setRecipientGender('P');
        TextFilters.setTuOuVous('V');
        break;
      case '016E91' : // Je pense à toi
      case 'D392C1' : // Sleep well
        if ( userGender == 'H' || userGender == 'F')
          TextFilters.setRecipientGender(invertGender(userGender));
        TextFilters.setTuOuVous('T');
        break;
    }

  }

  // In certain areas, filtering options will not be available tu users
  $scope.displayTextFilters = function () {
    return currentArea.name === "Formalities";
  };

}]);
