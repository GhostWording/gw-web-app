// Displays a list of texts
cherryApp.controller('TextListController',
 ['$scope', 'currentTextListSvc', 'currentIntention', 'currentArea',
function ($scope, currentTextListSvc, currentIntention, currentArea) {

    // //$scope.allowModalToPopNextTime = true;
    // $scope.popUpandSelect = function(txt,action) {
    //   //$scope.allowModalToPopNextTime = true;
    //   $('#modalEnvoiTexte').modal('show');
    //   $scope.selectThisText(txt,action);
    //   PostActionSvc.postActionInfo("Text",txt.TextId,"TextList", action );
    //   return false; // true
    // };

    // // Can be called directly from the view or as a second stage of selectAndPopUp
    // $scope.selectThisText = function (txt,action) {
    //   SendText.setSelectedTextLabel(txt.Content);
    //   SendText.setSelectedTextObject(txt);
    // };

    // $scope.getSelectedTextId = function(txt,id) {
    //   return SendText.getTextId();
    // };

    // We may want to display the title, the text, or the text as a quote
    $scope.whatToDisplay = function (txt) {
        if (currentArea.name === "Formalities")
            return HelperSvc.TxtDisplayModeEnum.Abstract;
        else
            return HelperSvc.shouldDisplayAsCitation(txt);
    };

    $scope.filtersWellDefined = function() {
      var filters = filtersSvc.filters;
      return filters.recipientGender && filters.tuOuVous;
    };


  }
]);