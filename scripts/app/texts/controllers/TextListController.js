angular.module('app/texts/TextListController', [])
// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentIntention', 'currentUser', 'filtersSvc', '$modal', 'currentRecipient', 'favouritesSvc','appUrlSvc','currentLanguage','textsSvc','intentionsSvc','currentAreaName','PostActionSvc','$window','filteredTextListSvc','tagLabelsSvc','HelperSvc','questionBarSvc','accordionSvc',
function ($scope, currentTextList, currentIntention,  currentUser, filtersSvc, $modal,currentRecipient, favouritesSvc,appUrlSvc,currentLanguage,textsSvc,intentionsSvc,currentAreaName,PostActionSvc,$window,filteredTextListSvc,tagLabelsSvc,HelperSvc,questionBarSvc,accordionSvc) {
  $scope.appUrlSvc = appUrlSvc;
  $scope.HelperSvc = HelperSvc;
  $scope.QuestionBar = questionBarSvc;

  $scope.labelsThatShouldBeDisplayed = function(txt) {
    var stylesWeWant = filtersSvc.filters.preferredStyles;
    var idsWeWant = stylesWeWant.filterIds(txt.TagIds);
//    return tagLabelsSvc.labelsFromStyleTagIds(txt.TagIds);
    return tagLabelsSvc.labelsFromStyleTagIds(idsWeWant);
  };


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

  $scope.theAccordionStatus = accordionSvc.theAccordionStatus;

  $scope.openAccordion = function() {
    $scope.theAccordionStatus.open = true;
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
      $scope.textList =textList;
      textsSvc.countTextsForStylesAndProperties(textList);
      accordionSvc.calculateMostSelectiveStyles();
      $scope.filterList();});
  }
  $scope.$watch(function() { return currentLanguage.getLanguageCode(); },prepareAndDisplayTextList(),true);

  var intentionId = (!! currentIntention ) ? currentIntention.Slug : intentionsSvc.getCurrentId();
  intentionsSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName,intentionId)
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
    filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeId); // Shoud not be reinitialized when we come back from TextDetail view
  }

  $scope.filteredTextList = filteredTextListSvc;

  var firstWatchCall = true;
  $scope.filterList = function () {
    //$scope.filteredList.length = 0;
    // TODO : This should not be called two times when view initializes
    if ( !firstWatchCall ) {
      filteredTextListSvc.setFilteredAndOrderedList($scope.textList, currentUser, filtersSvc.filters.preferredStyles);
    }
    $scope.filteredList = filteredTextListSvc.getFilteredTextList();
    firstWatchCall = false;
  };

  // Watch user gender and update filtered text list if they change
  $scope.$watch(function() { return currentUser.gender; }, $scope.filterList, true);
  // Watch the filters and update filtered text list if they change
  $scope.$watch(function() { return filtersSvc.filters; }, $scope.filterList, true);

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


 }]);