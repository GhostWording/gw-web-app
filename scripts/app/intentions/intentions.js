angular.module('app/intentions', [
  'app/areas',
  'common/services/cache',
  'common/services/server'
])

// This service provides promises to intentions for the application.
// It uses the cache or requests from the server
.factory('intentionsSvc', ['$q', '$stateChange', 'areasSvc', 'cacheSvc', 'serverSvc','currentLanguage', function($q, $stateChange, areasSvc, cacheSvc, serverSvc,currentLanguage) {
  var service = {

    getCurrentId: function() {
      return $stateChange.toParams && $stateChange.toParams.intentionId;
    },

    getCurrent: function() {
      var currentIntentionId = service.getCurrentId();
      if ( !currentIntentionId )
        return $q.when(null);
      return areasSvc.getCurrent().then(function(currentArea) {
        if ( currentArea ) {
          return service.getIntention(currentArea.Name, currentIntentionId);
        }
        else
          return $q.when(null);
      });
    },

    getForArea: function(areaName) {
      // TODO : should be cached per culture
      return cacheSvc.get('intentions.' + areaName, -1, function() {
        // TODO : for the time being translation of the intentions happen on the client : the french version is requested to the server
        return serverSvc.get(areaName + '/intentions',undefined,undefined,'fr-FR')
          .then(
            function(intentions) { intentions.sort(function (a, b) { return (a.SortOrder - b.SortOrder); }); return intentions; });
      });
    },
    // TODO : this tries using the is as an id and then as a slug
    // Slugs having become the prefered key, they are tried first
    getIntention: function(areaName, intentionIdOrSlug) {
      return cacheSvc.get(cacheSvc.makeIntentionCacheKey(areaName, intentionIdOrSlug),  -1,  function() {
        // For the time being translation of the intentions happen on the client : the french version is requested to the server
        return serverSvc.get(areaName + '/' + intentionIdOrSlug,undefined,undefined,'fr-FR') // get by slug API syntax
          .then(function(data) {return data;},
                function(error){ console.log(error);
                    if (error.status == "404") {
                      console.log(intentionIdOrSlug + " intention slug not found, trying as an id");
                      return serverSvc.get(areaName + '/intention/' + intentionIdOrSlug,undefined,undefined,'fr-FR'); // get by Id API syntax
                    }}
        );
      });
    },
    // Returns true if texts for the intention should be reloaded
    invalidateCacheIfNewerServerVersionExists: function (areaName, intentionIdOrSlug) {
      // Get the server version
      return serverSvc.get(areaName + '/' + intentionIdOrSlug, undefined, undefined, 'fr-FR').then(function (intentionFromServer) {
        // compare version with the cache
        return service.getIntention(areaName, intentionIdOrSlug).then(function (intentionFromCache) {
          var retval = false;
          // Invalidate cache description of intention if intention description changed
          if (intentionFromCache && intentionFromCache.UpdateDate != intentionFromServer.UpdateDate) {
            cacheSvc.reInitializeCacheEntry(cacheSvc.makeIntentionCacheKey(areaName, intentionIdOrSlug));
          }
          // Invalidate cached text list if it was modified on the server
          if ( intentionFromCache && intentionFromCache.MostRecentTextUpdate != intentionFromServer.MostRecentTextUpdate) {
            // Invalidate cache description of intention also : if we don't do that, MostRecentTextUpdate will always look out of date
            cacheSvc.reInitializeCacheEntry(cacheSvc.makeIntentionCacheKey(areaName, intentionIdOrSlug));
            // Invalidate cache description of text list for intention
            var culture = currentLanguage.currentCulture();
            // HACK : while we don't have spanish texts, display english ones instead
            if (culture == "es-ES") {
              culture = "en-EN";
            }
            var textListCacheKey = cacheSvc.makeTextListCacheKey(areaName, intentionIdOrSlug, culture);
            cacheSvc.reInitializeCacheEntry(textListCacheKey);
            retval = true;
          }
          return  retval;
        });
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

.controller('IntentionListController', ['$scope',  'intentionsSvc','currentRecipientSvc','likelyIntentionsSvc','appUrlSvc','currentAreaName',
function($scope,  intentionsSvc, currentRecipientSvc,likelyIntentionsSvc,appUrlSvc, currentAreaName) {
  $scope.appUrlSvc = appUrlSvc;
  $scope.currentAreaName = currentAreaName;

  //areasSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName); // now in routing

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
    currentRecipient = currentRecipientSvc.getCurrentRecipientNow();
    $scope.pageRecipient = currentRecipient ? currentRecipient.LocalLabel : "---";
  } else if ( !$scope.pageTitle ) {
    $scope.pageTitle = "Dites le !";
    console.log("Unknown area : ", currentAreaName);
  }


  var ITEMS_PER_ROW = 3;
  var recipientId = currentRecipientSvc.getCurrentRecipientId();
  $scope.recipientId = recipientId;
  // Get intentions for the current recipient : all this will be replaced by a call to server when  the APIs serve recipients
  if ( recipientId && recipientId != currentRecipientSvc.nullRecipientId && recipientId !== '' ) {
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
        return intentionsSvc.getForArea(currentAreaName)
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
    intentionsSvc.getForArea(currentAreaName)
      .then(function(intentions) {
        $scope.groupedIntentions = intentionsSvc.groupItems(intentions, ITEMS_PER_ROW);
        });
}]);
