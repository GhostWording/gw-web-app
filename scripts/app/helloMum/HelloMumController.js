angular.module('app/helloMum/HelloMumController', [])
.controller('HelloMumController', ['$scope','currentLanguage','$q','helloMumSvc','helloMumTextsSvc','helperSvc','currentUser','currentUserLocalData',
function($scope, currentLanguage,$q,helloMumSvc,helloMumTextsSvc,helperSvc) {



  helloMumTextsSvc.getWelcomeTextList('HelloMum','en-EN','53A0E1').then(function(texts) {
    // does not work :
//    $scope.welcomeTexts = helloMumTextsSvc.filterTextsForHelloMum(texts);

    var selectedTexts = helloMumTextsSvc.pickWelcomeTexts(texts,8);

//    $scope.welcomeTexts = texts;
    $scope.welcomeTexts = selectedTexts;

//    for (var i =0; i< texts.length; i++)
//      console.log(texts[i]);
  });

  // TODO : if we know the user gender, we should set it before calling filtering functions (or use a watch to refilter)
  //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male
  // TODO : add mechanism to check for cache staleness somewhere in the app

  // Get slugs and default weights for hello mum intentions (
  var weightedIntentions = helloMumSvc.intentionDefaultWeights();

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
  helloMumSvc.setIntentionWeights(weightedIntentions);

  // Get text list promises for the intentions (from cache if previously queried)

  currentLanguage.setLanguageCode('en',false); // Should be set when app initialize, or use 'en-EN'
  var textListPromises = helloMumTextsSvc.textListPromises(weightedIntentions,currentLanguage.currentCulture()); // 'en-EN' can be used as hard coded culture

    $scope.choices = [];

  // When all texts have been fetched
  $q.all(textListPromises).then(function (resolvedTextLists) {

    // Associate texts lists with weighted intentions
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

  // Will try to pick a random text until satisfied
  var chooseText = function(weightedIntentions) {
    var choice;
    var happyWithChoice = true;
    do {
       choice = helloMumSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
    } while (happyWithText(choice.text) === false);
    //console.log(choice.text.SortBy + ' ** ' + choice.text.Content);
    //console.log(choice.text);
    return choice;
  };

  // Let us say that 'burnt' texts are texts disliked + texts already sent
  // We don't want them

  // TODO : if chosen text is burnt, express deep sadness
  var happyWithText = function(pickedText) {
    // TODO : check that text has not been picked during this session
    // if matching text Id in $scope.choices, return false
    // TODO : check that text has not been disliked previously
    // TODO : check that text has not already been sent
    return true;
  };

  $scope.isQuote = function(txt) {
    return helperSvc.isQuote(txt); };

  // TODO : we also want to check that the number of burnt text is not too large
  // as compared to the number of available texts (for example nbBurnt < available * 0.80)
}]);

