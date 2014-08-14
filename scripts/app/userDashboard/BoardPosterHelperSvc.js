angular.module('app/userDashboard/boardPosterHelperSvc', ['app/texts'])

.factory('boardPosterHelperSvc', ['textsSvc','intentionsSvc','areasSvc','filterHelperSvc','recipientsHelperSvc','facebookSvc','facebookHelperSvc','subscribableRecipientsSvc','dashboardContextStyles','filteredTextsHelperSvc','currentUser',
function (textsSvc,intentionsSvc,areasSvc,filterHelperSvc,recipientsHelperSvc,facebookSvc,facebookHelperSvc,subscribableRecipientsSvc,dashboardContextStyles,filteredTextsHelperSvc,currentUser) {

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
    // Set value for poster filters depending on poser userFriend properties
    setPosterFilters: function(poster) {
      if ( ! poster.filters )
        poster.filters = filterHelperSvc.createEmptyFilters();
      if ( poster.userFriend ) {
        // Set gender filter
        if ( poster.userFriend.gender)
          poster.filters.recipientGender = facebookHelperSvc.getCVDGenderFromFbGender(poster.userFriend.gender);
        // Set context filter
        if ( !! poster.userFriend.ufContext ) {
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
    // calculate poster filtered list from full list and filters
    updateFilteredList: function(poster) {
      if ( poster.fullTextList.length > 0 && !! poster.filters )
        poster.filteredTextList = filteredTextsHelperSvc.getFilteredAndOrderedList(poster.fullTextList, currentUser, poster.filters.preferredStyles, poster.filters);
    },
    // Find label for recipient type
    getRecipientTypeLabel: function (id) {
      var valret = "";
      if (!!id) {
        var recipient = recipientsHelperSvc.getRecipientById(subscribableRecipientsSvc.getAllPossibleRecipientsNow(), id);
        valret = !!recipient ? recipient.dashLabel : "";
      }
      return valret;
    },
    // Find recipient types compatible with context (familial, pro,...)
    getCompatibleRecipients: function(poster) {
      return recipientsHelperSvc.getCompatibleRecipients(subscribableRecipientsSvc.getAllPossibleRecipientsNow(),currentUser,poster.userFriend,facebookSvc.getCurrentMe(),poster.userFriend.ufContext);
    },
    getPosterDebugInfo: function (poster) {
      var valret = "";
      if ( poster.txtIndex !== null  )
        valret += poster.txtIndex + " / ";
      valret += poster.filteredTextList.length;
      valret += " / ";
      valret += poster.fullTextList.length;
      return valret;
    }

  };

  return service;
}]);

