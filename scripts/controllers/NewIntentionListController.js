cherryApp.controller('NewIntentionListController',
  ['$scope', '$filter','$routeParams','FakeIntentions','Intentions','TheTexts', 'NormalTextFilters','SelectedIntention','HelperService' ,'SelectedArea',
  function ($scope, $filter,$routeParams, FakeIntentions, theIntentions,TheTexts,TextFilters,SelectedIntention,HelperService,SelectedArea) {
    TextFilters.initializeFiltersToUndefined(); // New instead of in TextListController to keep user filters when returning from detailed view

    // Read areaId from the url or use default areaId if nothing is found
    $scope.areaId = $routeParams.areaId;
    $scope.areaName = $routeParams.areaName;

    if ( $scope.areaName === undefined ){
      console.log('areaId === undefined');
      $scope.areaName = 'DayToDay';
    }

    SelectedArea.setSelectedAreaName($scope.areaName);

    // Choose title according to areaId : TODO : move to localisation service
    switch($scope.areaName) {
      case "Friends" :
            $scope.pageTitle = "Dites-le aux amis";
            break;
      case "LoveLife" :
            $scope.pageTitle = "Dites-lui !";
            break;
      case "Family" :
            $scope.pageTitle = "Dites-leur !";
            break;
      case "DayToDay" :
         $scope.pageTitle = "Vie quotidienne";
         break;
      case "Sentimental" :
        $scope.pageTitle = "Vie sentimentale";
        break;
      case "Important" :
         $scope.pageTitle = "Occasions spéciales"; // événements notables, saillants, singulier
         break;

      case "Formalities" :
         $scope.pageTitle = "Expédiez les formalités !";
         break;
      default :
         $scope.pageTitle = "Dites le !";
         console.log("Unknown area : " + $scope.areaName);
         break;
    }

  // Read intentions from server
  var intentions = [];
  var setIntentions = function(data) {intentions = data; };

  //FakeIntentions.query( setIntentions );
  //theIntentions.query( setIntentions,$scope.areaId );
  theIntentions.query( setIntentions,$scope.areaName );


  // Returns 0, 1, 2 ......one line number per available line of (nbColumnsPerLine) items
  $scope.getLineNumbers = function (nbColumnsPerLine) {
    return HelperService.getLineNumbers(intentions,nbColumnsPerLine);
  };
  // Returns items for the given line
  $scope.getLineElementsForLineNumber = function  (lineNumber, nbColumnsPerLine) {
    return HelperService.getLineElementsForLineNumber(intentions, lineNumber,nbColumnsPerLine);
  };

  // Memorize selected intention, not completly usefull if intention car be reread from cache using intention id in url
  $scope.SelectIntention = function (intention) {
    SelectedIntention.setSelectedIntention(intention);
  };

}]);


