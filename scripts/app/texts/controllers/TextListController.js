angular.module('app/texts/TextListController', [])
// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentIntention', 'currentUser', 'filtersSvc', '$modal', 'currentRecipient', 'favouritesSvc','appUrlSvc','currentLanguage','textsSvc','intentionsSvc','currentAreaName','PostActionSvc','$window',
function ($scope, currentTextList, currentIntention,  currentUser, filtersSvc, $modal,currentRecipient, favouritesSvc,appUrlSvc,currentLanguage,textsSvc,intentionsSvc,currentAreaName,PostActionSvc,$window) {
  $scope.appUrlSvc = appUrlSvc;

// url does not look like with that
//  $location.hash('leCorps');
//  $anchorScroll();
  // Some browser do not initialise the view correctly
  $window.scrollTo(0,0);

  $scope.getCurrentTextId = function() {
    var valret = textsSvc.getCurrentId();
    return valret;
  };

  $scope.currentAreaName = currentAreaName;

  $scope.currentIntention = currentIntention;
  $scope.textList = currentTextList;
  $scope.filteredList = [];

  $scope.accordionStatus = { };
  $scope.accordionStatus.open = false;

  $scope.openAccordion = function() {
    $scope.accordionStatus.open = true;
  };

  $scope.filters = filtersSvc.filters;
  $scope.filtersWellDefined = filtersSvc.wellDefined;
  //$scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);
  //$scope.currentRecipient = currentRecipientSvc.getCurrentRecipientNow();
  $scope.currentRecipient = currentRecipient;
  $scope.recipientId = $scope.currentRecipient ? $scope.currentRecipient.Id : 'none';
  $scope.currentRecipientLabel = "";
  if ( $scope.currentRecipient )
    $scope.currentRecipientLabel =  $scope.currentRecipient.LocalLabel;

  function prepareAndDisplayTextList() {
    textsSvc.getCurrentList().then(function(textList) {
      $scope.textList =textList; $scope.filterList();});
  }
  $scope.$watch(function() { return currentLanguage.getLanguageCode(); },
                prepareAndDisplayTextList(),true);
  intentionsSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName,currentIntention.Slug)
//  intentionsSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName,intentionsSvc.getCurrentId())
    .then(function(shouldReload){
        if (shouldReload)
          prepareAndDisplayTextList();
        });

   $scope.showTextsAnyway = function() {
    return currentAreaName == 'General';
  };

  $scope.isFavourite = function(txt) {
    return favouritesSvc.isExisting(txt);
  };

  $scope.setFavourite = function(txt, isFav) {
    favouritesSvc.setFavourite(txt, currentAreaName, currentIntention, isFav);
  };

  if ( currentRecipient ) {
    // Shoud not be reinitialized when we come back from TextDetail view
    filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeId);
  }


  $scope.filterList = function () {
    // Clear the previous filter list
    $scope.filteredList.length = 0;

    function applyFiltersthenOrderOnStyles(textList, currentUser, preferredStyles) {
      var filteredList = [];
      // A map used to count the number of matching styles indexed by text id
      var matchingStylesMap = {};
      // Add back in texts that are compatible with the current filters
      angular.forEach(textList, function (text) {
        if (filtersSvc.textCompatible(text, currentUser)) {
          filteredList.push(text);
          // This is a hack, when text is a quotation, we don't have a proper style tag for it so we add it on the fly
          var tagIds = angular.copy(text.TagIds); // We may need to copy that in case it modifies the original tag list ????
          matchingStylesMap[text.TextId] = preferredStyles.filterStyles(tagIds);
        }
      });

      // If there are no preferred style we don't want to perturbate ordering at all
      if (preferredStyles.stylesList.length > 0) {
        // Sort by number of matching preferred styles first
        filteredList.sort(function (text1, text2) {
          var count1 = matchingStylesMap[text1.TextId].stylesList.length * 100;
          var count2 = matchingStylesMap[text2.TextId].stylesList.length * 100;
          var retval = count2 - count1;
          // If texts score the same as far as styles go, use SortBy, but only if the are not meant to be randomized
          if (count1 == count2 && ( text1.SortBy < textsSvc.minSortOrderToBeRandomized || text2.SortBy < textsSvc.minSortOrderToBeRandomized  ))
            retval = -(text2.SortBy - text1.SortBy);
          return retval;
        });
      }
      return filteredList;
    }

    $scope.filteredList = applyFiltersthenOrderOnStyles($scope.textList, currentUser, filtersSvc.filters.preferredStyles);
  };

  $scope.send = function(text) {
    PostActionSvc.postActionInfo('Text',text.TextId, 'TextList','send');

    $scope.sendDialog = $modal.open({
      templateUrl: 'views/partials/sendTextForm.html',
      scope: $scope,
      controller: 'SendTextFormController',
      resolve: {
        currentText: function() { return text; }
      }
    });
  };

  // Watch the filters and update the filtered text list if they change
  $scope.$watch(function() { return filtersSvc.filters; }, $scope.filterList, true);



 }]);