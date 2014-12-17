angular.module('app/helloMum/HelloMumController', [])
.controller('HelloMumController', ['$scope','currentLanguage','$q','helloMumSvc','helloMumTextsSvc','helperSvc',
function($scope, currentLanguage,$q,helloMumSvc,helloMumTextsSvc,helperSvc) {
  // TODO : if we know the user gender, we should set it before calling filtering functions (or use a watch to refilter)
  //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male
  // TODO : add mechanism to check for cache staleness somewhere in the app

  // Get slugs and default weights for hello mum intentions (
  var weightedIntentions = helloMumSvc.intentionDefaultWeights();

  // TODO : adjust intention userWeight properties according to user choice (none, few, many)
  // .....

  // Set intention weights = defaultWeight * userWeight
  helloMumSvc.setIntentionWeights(weightedIntentions);

  // Get text list promises for the intentions (from cache if previously queried)

  currentLanguage.setLanguageCode('en',true); // Should be set when app initialize, or use 'en-EN'
  var textListPromises = helloMumTextsSvc.textListPromises(weightedIntentions,currentLanguage.currentCulture()); // 'en-EN' can be used as hard coded culture

    $scope.choices = [];

  // Filter and pick texts
  $q.all(textListPromises).then(function (resolvedTextLists) {
    helloMumTextsSvc.attachFilteredTextListsToWeightedIntentions(weightedIntentions,resolvedTextLists);

    //$scope.mumTexts=[];
    var nbTextsToDisplay =  8;
    for (var i = 0; i < nbTextsToDisplay;  i++  ) {
      var choice = chooseText(weightedIntentions);
        choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content," ");
        $scope.choices.push(choice);
    }
  });

  var chooseText = function(weightedIntentions) {
    // TODO : if chosen text is burnt, require another one instead
    var choice = helloMumSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
    console.log(choice.text.SortBy + ' ** ' + choice.text.Content);
    return choice;
  };
  $scope.isQuote = function(txt) { return helperSvc.isQuote(txt); };


}]);

// Let us says 'burnt' texts = texts disliked + texts already sent
// We want to check that the number of burnt text is too large (for example nbBurnt < available * 0.80)
// if so we could recycle texts already sent or suggest user to buy more
