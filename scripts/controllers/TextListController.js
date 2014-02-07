// Displays a list of texts
cherryApp.controller('TextListController',
 ['$scope', '$filter','$routeParams','$location', 'NormalTextFilters', 'SelectedText', 'SelectedIntention', 'TheTexts', 'AppUrlSvc', 'HelperService','PostActionSvc','SelectedArea','TextFilterHelperSvc', 'CurrentTextList',
function ($scope, $filter, $routeParams, $location, TextFilters,SendText,SelectedIntention, TheTexts, AppUrlSvc, HelperSvc,PostActionSvc,SelectedArea,TextFilterHelperSvc, CurrentTextList) {

    // Read area and intention id from url
    $scope.areaId = $routeParams.areaId;
    $scope.intentionId = $routeParams.intentionId;

    // Set current area and intention
    SelectedArea.setSelectedAreaName($scope.areaId);
    SelectedIntention.setSelectedIntentionId($scope.intentionId);

    // Initialize list of texts to be displayed
    $scope.TextListPanel = {};
    $scope.TextListPanel.lesTextes = [];
    // Watch the current text list and update the scope when it changes
    $scope.$watch(CurrentTextList.getCurrentTextList, function(textList) {
        $scope.TextListPanel.lesTextes = textList;
    });


    //$scope.allowModalToPopNextTime = true;
    $scope.popUpandSelect = function(txt,action) {
    //$scope.allowModalToPopNextTime = true;
      $('#modalEnvoiTexte').modal('show');
      $scope.selectThisText(txt,action);
      PostActionSvc.postActionInfo("Text",txt.TextId,"TextList", action );
      return false; // true
    };

    // Can be called directly from the view or as a second stage of selectAndPopUp
    $scope.selectThisText = function (txt,action) {
      SendText.setSelectedTextLabel(txt.Content);
      SendText.setSelectedTextObject(txt);
      $scope.currentText.txt = SendText.getSelectedTextLabel();
      $scope.currentText.id = txt.TextId;
    };

    $scope.getSelectedTextId = function(txt,id) {
      return SendText.getTextId();
    };

    // Only show texts when filters are fully set up
    $scope.hideTexts = function () {
       var v = !TextFilters.recipientFiltersFullyDefined();
        return v;
    };

    // We may want to display the title, the text, or the text as a quote
    $scope.whatToDisplay = function (txt) {
        if (SelectedArea.wantsToDisplayTextTitles())
            return HelperSvc.TxtDisplayModeEnum.Abstract;
        else
            return HelperSvc.shouldDisplayAsCitation(txt);
    };

  }
]);