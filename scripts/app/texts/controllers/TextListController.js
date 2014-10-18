angular.module('app/texts/TextListController', [])
// Displays a list of texts
.controller('TextListController',
 ['$scope', 'currentTextList', 'currentAreaName', 'currentIntention', 'currentUser', 'currentRecipient', 'currentLanguage', 'filtersSvc', 'textsSvc','intentionsSvc','postActionSvc','filteredTextListSvc','tagLabelsSvc','questionBarSvc','accordionSvc','$stateChange','$modal','$window',
function ($scope, currentTextList, currentAreaName, currentIntention,  currentUser, currentRecipient, currentLanguage, filtersSvc, textsSvc,intentionsSvc,postActionSvc,filteredTextListSvc,tagLabelsSvc,questionBarSvc,accordionSvc,$stateChange,$modal,$window) {

  // currentTextList might initialy come from the cache. Check server for stale cache. If stale, require a new text list : will update content showed to user
  intentionsSvc.invalidateCacheIfNewerServerVersionExists(currentAreaName,(!!currentIntention ) ? currentIntention.Slug : intentionsSvc.getCurrentId())
  .then(function(shouldReload){if (shouldReload)getAndFilterTextList( currentLanguage.currentCulture() );});

  // We want an Init event even if no action takes place, in case user lands here from Google or facebook link
  postActionSvc.postActionInfo('intention',currentIntention.IntentionId,'IntentionList','Init');
  // Some phone browser do not initialise the view correctly with  $location.hash('leCorps') and url does not look nice with   $anchorScroll()
  $window.scrollTo(0,0);

  // Read current text id from url (did not work well from routing.js)
  $scope.getCurrentTextId = function() {
    // Text id will be undefined when we come back from text detail to text list
    // That will tell the view to switch display from text detail to text list (could not figure how to do that in routing.js when comming back from text detail state)
    var valret = $stateChange.toParams.textId;
    textsSvc.setCurrentTextId(valret);
    return valret;
  };

  // Used by view to build urls, resolved from routing
  $scope.currentAreaName  = currentAreaName;
  $scope.currentIntention = currentIntention;
  // Recipient currently resolved from url
  $scope.currentRecipient = currentRecipient;
  $scope.recipientId      = $scope.currentRecipient ? $scope.currentRecipient.Id : 'none';
  $scope.currentRecipientLabel = $scope.currentRecipient ?  $scope.currentRecipient.LocalLabel :  "";
  // Services visible from the view
  $scope.theQuestionBarSvc = questionBarSvc;
  $scope.filtersWellDefined = filtersSvc.wellDefined;
  $scope.theAccordionStatus = accordionSvc.theAccordionStatus;
  $scope.openAccordion = function() {
    $scope.theAccordionStatus.open = true;
  };

  $scope.isThisAQuote = textsSvc.isQuote;

  // Unfiltered text list : initialize with resolved text list from routing
  var unfilteredTextList  = currentTextList;
  // Filtered text list that is actualy displayed
  $scope.filteredList = [];

  // Prepare the filtered text list that is displayed.
  var firstWatchCall = true;
  var filterList = function (textListToFilter) {
    // Optimization : filterList is called at least two times when view initializes. We skip the first time :-o
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

  // Update filters with current recipient type. Will be watched along with the filters
  if ( currentRecipient )
    filtersSvc.setRecipientTypeTag(currentRecipient.RecipientTypeTag);
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