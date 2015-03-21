angular.module('app/helloMum/HelloMumController', [])

.controller('HelloMumController', ['$scope','currentLanguage','$q','helloMumTextsSvc','helperSvc','intentionPonderationSvc','welcomeGroupTextSelectionSvc','helloMumClientSvc',
function($scope, currentLanguage,$q,helloMumTextsSvc,helperSvc,intentionPonderationSvc,welcomeGroupTextSelectionSvc,helloMumClientSvc) {

  // Get the WELCOME TEXT LIST for mums then pick a few for display
  helloMumClientSvc.getMumWelcomeTextList().then(function(texts) {
    $scope.welcomeTexts = welcomeGroupTextSelectionSvc.pickWelcomeTexts(texts,8,helloMumClientSvc.excludeTextFromFirstPositionOfMumTextList);
  });

  // Define THE INTENTIONS that will be used by the app, using their slug as id
  var weightedIntentions = helloMumClientSvc.intentionsToDisplay();
  // For real apps  : adjust intention userWeights according to user choice (none, few, many)
  // Then set intention weights = defaultWeight * userWeight
  intentionPonderationSvc.setIntentionWeights(weightedIntentions);
  // Get a text list promise for each intentions (from cache if previously queried)
  var textListPromises = helloMumTextsSvc.textListPromises(weightedIntentions,currentLanguage.currentCulture()); // 'en-EN' can be used as hard coded culture

  // When text lists have been fetched for all intentions, attach them to the weigthed intentions so they can be picked
  $q.all(textListPromises).then(function (resolvedTextLists) {
    $scope.choices = [];
    helloMumTextsSvc.attachFilteredTextListsToWeightedIntentions(weightedIntentions,resolvedTextLists);
    // Pick 8 texts
    for (var i = 0; i < 8;  i++  ) {
      // Will randomly choose an intention then a text
      var choice = helloMumClientSvc.chooseText(weightedIntentions);
      // Texts look better without quotation marks
      choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content," ");
      $scope.choices.push(choice);
    }
  });

  $scope.isQuote = function(txt) {
    return helperSvc.isQuote(txt);
  };

  // TODO for real apps : if we know the user gender, we should set it before calling filtering functions
  //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male
  // TODO for real apps  : add mechanism to check for cache staleness

}]);

