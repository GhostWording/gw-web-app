angular.module('app/texts/TextListController', [])
// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentIntention', 'currentArea', 'currentUser', 'filtersSvc', '$modal', 'currentRecipient', 'favouritesSvc','appUrlSvc','currentRecipientSvc','currentLanguage','textsSvc',
 function ($scope, currentTextList, currentIntention, currentArea, currentUser, filtersSvc, $modal,currentRecipient, favouritesSvc,appUrlSvc,currentRecipientSvc,currentLanguage,textsSvc) {
   $scope.appUrlSvc = appUrlSvc;

  $scope.currentArea = currentArea;
  $scope.currentIntention = currentIntention;
  $scope.textList = currentTextList;
  $scope.filteredList = [];

  $scope.filters = filtersSvc.filters;
  $scope.filtersWellDefined = filtersSvc.wellDefined;
  $scope.recipientId = currentRecipientSvc.getIdOfRecipient(currentRecipient);


  $scope.$watch(function() { return currentLanguage.getLanguageCode(); },
                function() { textsSvc.getCurrentList().then(function(textList) {
                                    $scope.textList =textList; $scope.filterList();});},
                true
                );


   $scope.showTextsAnyway = function() {
    return currentArea.Name == 'General';
  };

  $scope.isFavourite = function(txt) {
    return favouritesSvc.isExisting(txt);
  };

  $scope.setFavourite = function(txt, isFav) {
    favouritesSvc.setFavourite(txt, currentArea, currentIntention, $scope.recipientId, isFav);
  };

  if ( currentRecipient ) {
    filtersSvc.setFiltersForRecipient(currentRecipient); // Bug : shoud not be reinitialized when we come back from TextDetail view
    filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeId);
  }


  $scope.filterList = function() {
    // Clear the previous filter list
    $scope.filteredList.length = 0;

    // A map used to count the number of matching styles indexed by text id
    var matchingStylesMap = {};

    // Add back in texts that are compatible with the current filters
    angular.forEach($scope.textList, function(text) {
      if ( filtersSvc.textCompatible(text, currentUser) ) {
        $scope.filteredList.push(text);
        // This is a hack, when text is a quotation, we don't have a proper style tag for it so we add it on the fly
				var tagIds = angular.copy(text.TagIds); // We may need to copy that in case it modifies the original tag list ????
//				if ( text.IsQuote )
//					tagIds.push('citationCode');;;;
//					tagIds.push('BA46D4');
				matchingStylesMap[text.TextId] = $scope.filters.preferredStyles.filterStyles(tagIds);
      }
    });

    // If there are no preferred style we don't want to perturbate ordering at all
    if ( $scope.filters.preferredStyles.stylesList.length > 0 ) {
      // Sort by number of matching preferred styles first
      $scope.filteredList.sort(function(text1,text2) {
        var count1 = matchingStylesMap[text1.TextId].stylesList.length;
        var count2 = matchingStylesMap[text2.TextId].stylesList.length;
        //return (count1 != count2) ? count2 - count1 : -(text2.SortBy - text1.SortBy);
        return count2 - count1; // In case of equality, we keep the existing ordering in case it was randomized
      });
    }
  };

  $scope.send = function(text) {
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