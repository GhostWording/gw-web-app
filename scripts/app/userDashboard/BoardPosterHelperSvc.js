angular.module('app/userDashboard/boardPosterHelperSvc', ['app/texts'])

.factory('boardPosterHelperSvc', ['textsSvc','intentionsSvc','areasSvc','filterHelperSvc','recipientsHelperSvc','facebookHelperSvc','subscribableRecipientsSvc','dashboardContextStyles',
function (textsSvc,intentionsSvc,areasSvc,filterHelperSvc,recipientsHelperSvc,facebookHelperSvc,subscribableRecipientsSvc,dashboardContextStyles) {

  var service = {
    // Get poster text list from cache or server for the poster section intention
    setPosterTextList: function (poster) {
      var intentionSlug = poster.section.sectionType == 'intention' ? poster.section.sectionTargetId : 'none-for-the-time-being';
      // In cacheSvc the texts are copied as in return angular.copy(value); = if the app gets slow we might want to send the original (not to be modified) list
      textsSvc.getListForCurrentArea(intentionSlug).then(function (textList) {
        poster.fullTextList = textList;
        // Cache is quick but it might be stale. Check server for newer version in case
        intentionsSvc.invalidateCacheIfNewerServerVersionExists(areasSvc.getCurrentName(), intentionSlug)
          // If newer version, we might want to update current display right away
        .then(function (shouldReload) {
          if (shouldReload) {
            textsSvc.getListForCurrentArea(intentionSlug).then(function (reloadedTextList) {
              poster.fullTextList = reloadedTextList;
            });
          }
        });
      });
    },
    // Derive poster filters from poster userFriend properties
    setPosterFilters: function(poster) {
      if ( ! poster.filters )
        poster.filters = filterHelperSvc.createEmptyFilters();
      if ( poster.userFriend ) {
        // Set gender filter
        if ( poster.userFriend.gender)
          poster.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(poster.userFriend.gender);
        // Set context filter
        if ( !! poster.userFriend.ufContext ) {
          //var availableContextsStyles = dashboardContextStyles;
          var contextStyle = dashboardContextStyles.stylesByName[poster.userFriend.ufContext];
          filterHelperSvc.setContextTypeTag(poster.filters, contextStyle);
        }
        if ( !! poster.userFriend.ufRecipientTypeId ) {
          var recipient = recipientsHelperSvc.getRecipientById(subscribableRecipientsSvc.getAllPossibleRecipientsNow(), poster.userFriend.ufRecipientTypeId);
          if ( recipient )
            filterHelperSvc.setRecipientTypeTag(poster.filters, recipient.RecipientTypeId);
        }
      }
    },

    getRecipientTypeLabel: function (id) {
      var valret = "";
      if (!!id) {
        var recipient = recipientsHelperSvc.getRecipientById(subscribableRecipientsSvc.getAllPossibleRecipientsNow(), id);
        valret = !!recipient ? recipient.dashLabel : "";
      }
      return valret;
    }



  };

  return service;
}]);

