angular.module('app/intentions/IntentionListController', [])

.controller('IntentionListController', ['$scope',  'intentionsSvc','currentRecipientSvc','likelyIntentionsSvc','appUrlSvc','currentAreaName','areasSvc',
  function($scope,  intentionsSvc, currentRecipientSvc,likelyIntentionsSvc,appUrlSvc, currentAreaName,areasSvc) {
    $scope.appUrlSvc = appUrlSvc;
    $scope.currentAreaName = currentAreaName;

    // Ask server if intention list for this area is stale
    // We should then redisplay intentions if a change has been detected
    areasSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName);

    // Choose title according to areaId : TODO : move to localisation service
    var AREA_PAGE_TITLE = {
      "Friends" : "Dites-le aux amis",
      "LoveLife" : "Dites-lui !",
      "Family" : "Dites-leur !",
      "Important" : "Occasions spéciales", // événements notables, saillants, singulier
      "Formalities" : "Expédiez les formalités !",
      "General" : "Rubriques"
    };
    $scope.pageTitle = AREA_PAGE_TITLE[currentAreaName];

    $scope.isForRecipient = false;
    if ( currentAreaName == 'Addressee') {
      $scope.isForRecipient = true;
      $scope.pageTitle = "";
      var currentRecipient = currentRecipientSvc.getCurrentRecipientNow();
      $scope.pageRecipient = currentRecipient ? currentRecipient.LocalLabel : "---";
    } else if ( !$scope.pageTitle ) {
      $scope.pageTitle = "Dites le !";
      console.log("Unknown area : ", currentAreaName);
    }


    var ITEMS_PER_ROW = 3;
    var recipientId = currentRecipientSvc.getCurrentRecipientId();
    $scope.recipientId = recipientId;
    // Get intentions for the current recipient : all this will be replaced by a call to server when  the APIs serve recipients
    // Should be moved to a service in the mean time
    if ( recipientId && recipientId != currentRecipientSvc.getNullRecipientId() && recipientId !== '' ) {
      currentRecipientSvc.getCurrentRecipient()
        // Get recipientTYPE Id (different from recipient id)
      .then(function (currentRecipient) {
        return currentRecipient.RecipientTypeTag;
      })
        // Get LikelyIntentions for the RecipientType : we should directly get intentions from the server
      .then(function(recipientTypeTag) {
        return likelyIntentionsSvc.getLikelyIntentionsforGivenRecipientType(recipientTypeTag)
        .then(function(likelyIntentions) {
          return likelyIntentions;});
      })
        // Using intentionId property in likelyIntentions, get the full intentions from the intention list
      .then(function (likelyIntentions) {
        return intentionsSvc.getIntentionsForArea(currentAreaName)
        .then(function (intentions) {
          return likelyIntentionsSvc.getFullIntentionObjectsFromLikelyIntentions(intentions, likelyIntentions);});
      })
        // Get intentions from the ids of our likely intentions
      .then (function(intentions) {
        $scope.groupedIntentions = intentionsSvc.groupItems(intentions, ITEMS_PER_ROW);
      })
      ;
    }
    else
    // Get intentions for the current area
      intentionsSvc.getIntentionsForArea(currentAreaName)
      .then(function(intentions) {
        $scope.groupedIntentions = intentionsSvc.groupItems(intentions, ITEMS_PER_ROW);
      });
  }]);
