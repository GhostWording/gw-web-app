angular.module('app/intentions', ['app/areas', 'common/services/cache', 'common/services/server'])

// This service provides promises to intentions for the application.
// It uses the cache or requests from the server
.factory('intentionsSvc', ['$q', '$route', 'areasSvc', 'cacheSvc', 'serverSvc', function($q, $route, areasSvc, cacheSvc, serverSvc) {
  var service = {

    getCurrentId: function() {
      return $route.current && $route.current.params.intentionId;
    },

    getCurrent: function() {
      var currentIntentionId = service.getCurrentId();
      return areasSvc.getCurrent().then(function(currentArea) {
        if ( currentArea ) {
          return service.getIntention(currentArea.Name, currentIntentionId);
        }
      });
    },

    getForArea: function(areaName) {
      return cacheSvc.get('intentions.' + areaName, -1, function() {
        return serverSvc.get(areaName + '/intentions').then(function(intentions) {
            // Sort the intentions by the SortOrder property
            intentions.sort(function (a, b) {
                return (a.SortOrder - b.SortOrder);
            });
            return intentions;
        });
      });
    },

    getIntention: function(areaName, intentionId) {
      return cacheSvc.get('intentions.' + areaName + '.' + intentionId, -1, function() {
        return serverSvc.get(areaName + '/intention/' + intentionId);
      });
    },
    groupItems: function(items, columns) {
      var rows = [];
      while(items.length>0) {
        rows.push(items.splice(0,columns));
      }
      return rows;
    }

  };

  return service;
}])

.controller('IntentionListController', ['$scope', 'currentArea', 'intentionsSvc','currentRecipientSvc','likelyIntentionsSvc',
function($scope, currentArea, intentionsSvc,currentRecipientSvc,likelyIntentionsSvc) {

  // Choose title according to areaId : TODO : move to localisation service
  var AREA_PAGE_TITLE = {
    "Friends" : "Dites-le aux amis",
    "LoveLife" : "Dites-lui !",
    "Family" : "Dites-leur !",
    "Important" : "Occasions spéciales", // événements notables, saillants, singulier
    "Formalities" : "Expédiez les formalités !",
  };
  $scope.pageTitle = AREA_PAGE_TITLE[currentArea.Name];
  if ( !$scope.pageTitle ) {
    $scope.pageTitle = "Dites le !";
    console.log("Unknown area : ", currentArea);
  }

  $scope.currentArea = currentArea;
  var ITEMS_PER_ROW = 3;

  var recipientId = currentRecipientSvc.getCurrentRecipientId();
  // Get intentions for the current recipient : all this mess will be replaced by a call to server when it's up to date with recipient stull
  if ( recipientId && recipientId != 'none' && recipientId !== '' ) {
    $scope.recipientId = recipientId;
    currentRecipientSvc.getCurrentRecipient()
      // Get recipientTYPE Id (different from recipient id)
      .then(function (currentRecipient) {
        return currentRecipient.RecipientTypeId;
      })
      // Get LikelyIntentions for the RecipientType : we should directly get intentions from the server
      .then(function(recipientTypeId) {
        return likelyIntentionsSvc.getLikelyIntentionsforGivenRecipientType(recipientTypeId)
          .then(function(likelyIntentions) {
             return likelyIntentions;});
      })
      // Using intentionId property in likelyIntentions, get the full intentions from the intention list
      .then(function (likelyIntentions) {
        return intentionsSvc.getForArea(currentArea.Name)
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
    intentionsSvc.getForArea(currentArea.Name)
      .then(function(intentions) {
        $scope.groupedIntentions = intentionsSvc.groupItems(intentions, ITEMS_PER_ROW);
        });

}]);
