angular.module('app/helloMum/HelloMumController', [])

.controller('HelloMumController', ['$scope','currentLanguage','$q','helloMumTextsSvc','helperSvc','intentionPonderationSvc','weightedTextRandomPickSvc','textsSvc','welcomeGroupTextSelectionSvc',
function($scope, currentLanguage,$q,helloMumTextsSvc,helperSvc,intentionPonderationSvc,weightedTextRandomPickSvc,textsSvc,welcomeGroupTextSelectionSvc) {

  // WELCOME TEXT GROUP
  // Get welcome text groups for mums : a list of texts that will be displayed when the app launches for the first time
  var getMumWelcomeTextList =  function () {
    var groupId;
    switch (currentLanguage.getLanguageCode()) {
      case 'fr':
        groupId = '774EE7';
        break;
      default:
        groupId = '53A0E1';
        break;
    }
    return textsSvc.getTextListForGroup('HelloMum', groupId, currentLanguage.getCultureCode(), true, true);
  };

  // For mums, we do not want the first texts to be is Jokes, facebook status, positive thoughts, or other impersonal texts
  var excludeTextFromFirstPositionOfMumTextList = function(text) {
    var intentionId = text.IntentionId;
    if (  intentionId == "0B1EA1" || intentionId == "2E2986" || intentionId == "A64962" || intentionId == "67CC40" )
      return true;
    return false;
  };

  // Get the welcome text list then pick a few for display
  getMumWelcomeTextList().then(function(texts) {
    $scope.welcomeTexts = welcomeGroupTextSelectionSvc.pickWelcomeTexts(texts,8,excludeTextFromFirstPositionOfMumTextList);
  });


  // FETCH A TEXT LIST FOR EACH INTERESTING INTENTION

  // Get slugs and default weights for hello mum intentions (
  var weightedIntentions = intentionPonderationSvc.intentionDefaultWeights();

  // TODO : adjust intention userWeight properties according to user choice (none, few, many)
  // Example this will only keep the first intention (how-are-you?)
  //  function setFakeWeights(weightedIntentions) {
  //    for (var i = 0; i < weightedIntentions.length; i++) {
  //      if (i > 0) {
  //        weightedIntentions[i].userWeight = 0;
  //      }
  //    }
  //  }
  //  setFakeWeights(weightedIntentions);

  // Set intention weights = defaultWeight * userWeight
  intentionPonderationSvc.setIntentionWeights(weightedIntentions);

  // Get text list promises for each intentions (from cache if previously queried)
  var textListPromises = helloMumTextsSvc.textListPromises(weightedIntentions,currentLanguage.currentCulture()); // 'en-EN' can be used as hard coded culture

  $scope.choices = [];
  // When text lists have been fetched for all intentions, attach them to the weigthed intentions so they can be picked
  $q.all(textListPromises).then(function (resolvedTextLists) {

    helloMumTextsSvc.attachFilteredTextListsToWeightedIntentions(weightedIntentions,resolvedTextLists);
    // Pick 8 texts
    for (var i = 0; i < 8;  i++  ) {
      // Will randomly choose an intention then a text
      var choice = chooseText(weightedIntentions);
        // Texts may look better without quotation marks
        choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content," ");
        $scope.choices.push(choice);
    }
  });


  // Try to pick a random text until satisfied
  var chooseText = function(weightedIntentions) {
    var choice;
    var happyWithChoice = true;
    do {
       choice = weightedTextRandomPickSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
    } while (happyWithText(choice.text) === false);
    return choice;
  };
  // Always returns true, instead we could check that a text has not been previously disliked, or seen to many times
  var happyWithText = function(pickedText) { return true; };

  $scope.isQuote = function(txt) {
    return helperSvc.isQuote(txt);
  };

  // TODO for real apps : if we know the user gender, we should set it before calling filtering functions
  //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male
  // TODO for real apps  : add mechanism to check for cache staleness

}]);

