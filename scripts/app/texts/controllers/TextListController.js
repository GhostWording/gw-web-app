angular.module('app/texts/TextListController', [])
// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentAreaName', 'currentIntention', 'currentUser', 'currentRecipient', 'currentLanguage', 'filtersSvc', 'favouritesSvc','appUrlSvc','textsSvc','intentionsSvc','postActionSvc','filteredTextListSvc','tagLabelsSvc','helperSvc','questionBarSvc','accordionSvc','$stateChange','$modal','$window',
function ($scope, currentTextList, currentAreaName, currentIntention,  currentUser, currentRecipient, currentLanguage, filtersSvc, favouritesSvc,appUrlSvc,textsSvc,intentionsSvc,postActionSvc,filteredTextListSvc,tagLabelsSvc,helperSvc,questionBarSvc,accordionSvc,$stateChange,$modal,$window) {

  // We want an Init event even if no action takes place, in case user lands here from Google or facebook
  postActionSvc.postActionInfo('intention',currentIntention.IntentionId,'IntentionList','Init');
  // Some phone browser do not initialise the view correctly with  $location.hash('leCorps') and url does not look nice with   $anchorScroll()
  $window.scrollTo(0,0);

  // Initial currentTextList might come from the cache. Check server for stale cache. If stale, require a new text list : will update content showed to user
  intentionsSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName,(!!currentIntention ) ? currentIntention.Slug : intentionsSvc.getCurrentId())
  .then(function(shouldReload){if (shouldReload)getAndFilterTextList( currentLanguage.currentCulture() );});

  // Read current text id from url (view will switch display from text list to text detail if textId is defined)
  $scope.getCurrentTextId = function() {
    var valret = $stateChange.toParams.textId;
    textsSvc.setCurrentTextId(valret);
    return valret;
  };

  // Used by view to build urls, resolved from url
  $scope.currentAreaName  = currentAreaName;
  $scope.currentIntention = currentIntention;
  // Recipient currently resolved from url
  $scope.currentRecipient = currentRecipient;
  $scope.recipientId      = $scope.currentRecipient ? $scope.currentRecipient.Id : 'none';
  $scope.currentRecipientLabel = $scope.currentRecipient ?  $scope.currentRecipient.LocalLabel :  "";

  // Give visibility to services
  $scope.theHelperSvc = helperSvc;
  $scope.theQuestionBarSvc = questionBarSvc;
  $scope.filtersWellDefined = filtersSvc.wellDefined;
  $scope.theAccordionStatus = accordionSvc.theAccordionStatus;
  $scope.openAccordion = function() {
    $scope.theAccordionStatus.open = true;
  };

  // Update filters with current recipient type
  if ( currentRecipient )
    filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeTag);

  // Unfiltered text list : initialize with resolved text list from routing
  var unfilteredTextList  = currentTextList;

  // Filtered text list that is actualy displayed
  $scope.filteredList = [];

  // Prepare the filtered text list to be displayed.
  var firstWatchCall = true;
  var filterList = function (textListToFilter) {
    // filterList is called at least two times when view initializes. We skip the first time :-o
    if ( !firstWatchCall )
      filteredTextListSvc.setFilteredAndOrderedList(textListToFilter, currentUser, filtersSvc.filters.preferredStyles);
    firstWatchCall = false;
    return filteredTextListSvc.getFilteredTextList();
  };

  // Get text list for area, intention and culture, then filter it
  var getAndFilterTextList = function(culture) {
    textsSvc.getCurrentTextList(culture).then(function(textList) {
      unfilteredTextList = textList;
      $scope.filteredList = filterList(unfilteredTextList);}
    );
  };

  // Get and filter list when language changes
  $scope.$watch(function() { return currentLanguage.getLanguageCode(); },getAndFilterTextList( currentLanguage.currentCulture() ),true);
  // Filter list when user gender changes
  $scope.$watch(function() { return currentUser.gender; },function() {$scope.filteredList = filterList(unfilteredTextList);},true);
  // Filter when filters change
  $scope.$watch(function() { return filtersSvc.filters; },function() {$scope.filteredList = filterList(unfilteredTextList);},true);
  // Update styles suggested by accordion when unfiltered list changes
  $scope.$watch(function() { return unfilteredTextList.length; }, function() {accordionSvc.calculateMostSelectiveStyles(); },true);

  // Get displayable style names for the text (imaginative, poetic,..)
  $scope.labelsThatShouldBeDisplayed = function(txt) {
    return tagLabelsSvc.labelsFromStyleTags(txt.TagIds,filtersSvc.filters.preferredStyles );
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