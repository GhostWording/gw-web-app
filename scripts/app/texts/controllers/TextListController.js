angular.module('app/texts/TextListController', [])
// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentIntention', 'currentUser', 'filtersSvc', '$modal', 'currentRecipient', 'favouritesSvc','appUrlSvc','currentLanguage','textsSvc','intentionsSvc','currentAreaName','PostActionSvc','$window','filteredTextListSvc',
function ($scope, currentTextList, currentIntention,  currentUser, filtersSvc, $modal,currentRecipient, favouritesSvc,appUrlSvc,currentLanguage,textsSvc,intentionsSvc,currentAreaName,PostActionSvc,$window,filteredTextListSvc) {
  $scope.appUrlSvc = appUrlSvc;

  // Some phone browser do not initialise the view correctly
  //  $location.hash('leCorps');
  //  $anchorScroll(); // url does not look nice with that
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

    // TODO : This should not be called two times when view initializes
//    $scope.filteredList = applyFiltersthenOrderOnStyles($scope.textList, currentUser, filtersSvc.filters.preferredStyles);
    $scope.filteredList = filteredTextListSvc.applyFiltersThenOrderOnStyles($scope.textList, currentUser, filtersSvc.filters.preferredStyles);


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