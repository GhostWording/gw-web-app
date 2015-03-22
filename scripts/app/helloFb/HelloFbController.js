angular.module('app/helloFb/HelloFbController', ['common/i18n/currentLanguage'])

.controller('HelloFbController', ['$scope','currentLanguage','$q','helperSvc','intentionPonderationSvc','welcomeGroupTextSelectionSvc','helloFbClientSvc','getTextsForRecipientSvc',
function($scope, currentLanguage,$q,helperSvc,intentionPonderationSvc,welcomeGroupTextSelectionSvc,helloFbClientSvc,getTextsForRecipientSvc) {

  var areaName = 'FbFriendsDaily';
  // Relation type is other friends
  var relationTypeId = '6E7DFB';
  // We do not know recipient gender + we want texts that do not address a specific recipient : EI for Explicitly Indifferent
  var recipientGender = 'EI';
//  var recipientGender = 'H';
  // Let us assume the app user is a man (H = Homme = Male), we should ask the user for this information
  var userGender = 'H';

  var languageCode = currentLanguage.getLanguageCode();
  var cultureCode = currentLanguage.getCultureCode();
  // Get the WELCOME TEXT LIST for mums then pick a few for display
  helloFbClientSvc.getMumWelcomeTextList(areaName,languageCode,cultureCode).then(function(texts) {
    $scope.welcomeTexts = welcomeGroupTextSelectionSvc.pickWelcomeTexts(texts,8,helloFbClientSvc.excludeTextFromFirstPositionOfMumTextList);
  });


  // Define THE INTENTIONS that will be used by the app, using their slug as id
  var weightedIntentions = helloFbClientSvc.intentionsToDisplay();
  // For real apps  : adjust intention userWeights according to user choice (none, few, many)
  // Then set intention weights = defaultWeight * userWeight
  intentionPonderationSvc.setIntentionWeights(weightedIntentions);
  // Get a text list promise for each intentions (from cache if previously queried),
  // With optional relation type (such as parent or sibling) and recpient gender (such as Female for mother) to limit network traffic : we could also get all the texts as they will be refiltered later
  var textListPromises = getTextsForRecipientSvc.textPromisesForTextLists(areaName,weightedIntentions,currentLanguage.currentCulture(),relationTypeId,recipientGender);

  // When text lists have been fetched for all intentions, attach them to the weighted intentions so they can be picked
  $q.all(textListPromises).then(function (resolvedTextLists) {
    $scope.choices = [];
    // filter the text list for each intention and add it to the array
    helloFbClientSvc.attachFilteredTextListsToIntentions(weightedIntentions,resolvedTextLists,relationTypeId,recipientGender,userGender);
    // Pick 8 texts
    for (var i = 0; i < 8;  i++  ) {
      // Will randomly choose an intention then a text
      var choice = helloFbClientSvc.chooseText(weightedIntentions);
      // Texts look better without quotation marks
      choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content," ");
      $scope.choices.push(choice);
    }
  });

  $scope.isQuote = function(txt) {
    return helperSvc.isQuote(txt);
  };

  // TODO for real apps  : add mechanism to check for cache staleness and refresh cache if necessary
  //reinitializeCacheForIntentionAndRecipient : function (areaName,intentionSlug, culture,relationTypeId, recipientGender) {
}]);

