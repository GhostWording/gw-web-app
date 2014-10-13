angular.module('app/texts/TextListController', [])
// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentIntention', 'currentUser', 'filtersSvc', '$modal', 'currentRecipient', 'favouritesSvc','appUrlSvc','currentLanguage','textsSvc','intentionsSvc','currentAreaName','postActionSvc','$window','filteredTextListSvc','tagLabelsSvc','helperSvc','questionBarSvc','accordionSvc','$stateChange',
function ($scope, currentTextList, currentIntention,  currentUser, filtersSvc, $modal,currentRecipient, favouritesSvc,appUrlSvc,currentLanguage,textsSvc,intentionsSvc,currentAreaName,postActionSvc,$window,filteredTextListSvc,tagLabelsSvc,helperSvc,questionBarSvc,accordionSvc,$stateChange) {
  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('intention',currentIntention.IntentionId,'IntentionList','Init');
  // Some phone browser do not initialise the view correctly with  $location.hash('leCorps') and url does not look nice with   $anchorScroll()
  $window.scrollTo(0,0);

  // Used by view to build urls
  $scope.currentAreaName = currentAreaName;
  $scope.currentIntention = currentIntention;
  $scope.recipientId = $scope.currentRecipient ? $scope.currentRecipient.Id : 'none';

  // Give visibility to services
  $scope.appUrlSvc = appUrlSvc;
  $scope.helperSvc = helperSvc;
  $scope.questionBarSvc = questionBarSvc;
  $scope.filteredTextListSvc = filteredTextListSvc;
  $scope.filters = filtersSvc.filters;
  $scope.filtersWellDefined = filtersSvc.wellDefined;
  $scope.currentRecipient = currentRecipient;
  $scope.currentRecipientLabel = $scope.currentRecipient ?  $scope.currentRecipient.LocalLabel :  "";
  $scope.theAccordionStatus = accordionSvc.theAccordionStatus;
  $scope.openAccordion = function() {
    $scope.theAccordionStatus.open = true;
  };

  // Read current text id from url : will switch display between text list and text detail view
  $scope.getCurrentTextId = function() {
    var valret = $stateChange.toParams.textId;
    textsSvc.setCurrentTextId(valret);
    return valret;
  };

  // Unfiltered text list : initialize with resolved text list from router
  var unfilteredTextList  = currentTextList;
  // The filtered text list actualy displayed
  $scope.filteredList = [];

  // Prepare the filtered text list to be displayed. On initialisation, do it with resolved text list
  var firstWatchCall = true;
  var filterList = function (textListToFilter) {
    // Optimization : setFilteredAndOrderedList should not be called two times when view initializes. So we dont call it the first time
    if ( !firstWatchCall )
      filteredTextListSvc.setFilteredAndOrderedList(textListToFilter, currentUser, filtersSvc.filters.preferredStyles);
    firstWatchCall = false;
    $scope.filteredList = filteredTextListSvc.getFilteredTextList();
    return $scope.filteredList;
  };

  // Ask for new text list, count properties displayable to user, then filter list
  var prepareAndDisplayTextList = function(culture) {
    textsSvc.getCurrentTextList(culture).then(function(textList) {
      unfilteredTextList =textList;
      //textsSvc.countTextsForStylesAndProperties(textList);
      accordionSvc.calculateMostSelectiveStyles();
      filterList(unfilteredTextList);}
    );
  };

  // Get new list and filter when language changes
  $scope.$watch(function() { return currentLanguage.getLanguageCode(); },prepareAndDisplayTextList( currentLanguage.currentCulture() ),true);
  // Filter when user gender changes
  $scope.$watch(function() { return currentUser.gender; },
      function() {filterList(unfilteredTextList);},
  true);
  // Filter when filters change
  $scope.$watch(function() { return filtersSvc.filters; },
      function() {filterList(unfilteredTextList);},
  true);
  // Get new list and filter if server cache says it is stale
  var intentionId = (!! currentIntention ) ? currentIntention.Slug : intentionsSvc.getCurrentId();
  intentionsSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName,intentionId)
    .then(function(shouldReload){
        if (shouldReload)
          prepareAndDisplayTextList( currentLanguage.currentCulture() );
        });

  // Update filters with current recipient type : should be watched if it can change (currently does not change, it is read from the view url)
  if ( currentRecipient ) {
    filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeTag); // Shoud not be reinitialized when we come back from TextDetail view
  }


  // Get displayable style names for the text (imaginative, poetic,..)
  $scope.labelsThatShouldBeDisplayed = function(txt) {
    var stylesWeWant = filtersSvc.filters.preferredStyles;
    var idsWeWant = stylesWeWant.filterIds(txt.TagIds);
    return tagLabelsSvc.labelsFromStyleTagIds(idsWeWant);
  };


  // Open send text dialog
  $scope.send = function(text) {
    postActionSvc.postActionInfo('Text',text.TextId, 'TextList','send');
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