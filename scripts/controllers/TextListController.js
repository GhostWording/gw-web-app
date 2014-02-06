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

    // Change filtered text list (and TextCount) each time TextFilters change
    $scope.filters = TextFilters.filterValuesToWatch;


    // Exclude texts not matching tags and properties
    function filterAndReorder(TheTexts, TextFilters) {
//        $scope.TextListPanel.lesTextes = TheTexts.filterAndReorder(TextFilters);
        return $scope.TextListPanel.lesTextes;
    }

    // Filter and reorder texts after user changes filters such as recipient gender
    var isFirstWriteChangeCall = true;
    var reorderAfterFiltering = function (){
      if ( isFirstWriteChangeCall )
        isFirstWriteChangeCall = false;
      else
        filterAndReorder(TheTexts, TextFilters);
    };
    $scope.$watch('filters()',reorderAfterFiltering,true);

    // Filter and reorder texts after user changes prefered styles
    var isFirstReorderTextsCall = true;
    var reorderTexts = function () {
        // First call is fake
        if (isFirstReorderTextsCall)
            isFirstReorderTextsCall = false;
        else {
            var t = filterAndReorder(TheTexts, TextFilters);
            // This is an ugly hack so that when we go TextList => TextDetail => TextList again, we get back the good texts
//            TheTexts.cacheReorderedTexts(t, $scope.intentionId);
        }
    };
    $scope.$watch(TextFilters.preferedStylesToWatch,reorderTexts,true);

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

// OLD CODE

// All this should go in a routing module
// if only one parameter, it's a slug shortcut that implies both area and intention
//var intentionSlug = $routeParams.intentionSlug;
//if (intentionSlug !== undefined) {
//    switch (intentionSlug) {
//        case 'BonneAnnee':
//            $scope.areaId = 'Important';
//            $scope.intentionId = '938493';
//            break;
//        default:
//            console.log('Unknown intentionSlug ' + intentionSlug);
//            $location.url('/');
//            return;
//            break;
//    }
//}

// Unless the texts are already cached, read the first few texts from the server to display something quickly
//if (!TheTexts.textsAlreadyCachedForIntention($scope.intentionId)) {
//    TheTexts.resetTexts();
//    // If there are many texts, we could load the 7 first texts so the user sees something quickly, complete list query could then be lanched from doIfFirstTextsRead
////      TheTexts.queryTexts(intentionId, $scope.areaId,  doIfFirstTextsRead,doIfErrorReadingTexts, false, 7);
//    TheTexts.queryTexts($scope.intentionId, $scope.areaId, doIfAllTextsRead, doIfErrorReadingTexts, true);
//}
//else
//    TheTexts.queryTexts($scope.intentionId, $scope.areaId, doIfAllTextsRead, doIfErrorReadingTexts, true);


// Hack : When doNothing is called before selectThisText, we can prevent popup from showing
//    $scope.doNothing = function () {
//      $scope.allowModalToPopNextTime = false;
//      return false;
//    };


// If we preload a few text, we want to load the rest after
//function doIfFirstTextsRead(data) {
//    // Show some progress on the progress bar
//    $scope.TextListPanel.progressBarWidth = 70;
//    // Populate list of texts.
//    $scope.TextListPanel.lesTextes = TextFilterHelperSvc.filterOnBasicFilters(data,TextFilters );
//    // Fetch complete list from the server
//    TheTexts.queryTexts($scope.intentionId, $scope.areaId,  doIfAllTextsRead,doIfErrorReadingTexts, true);
//}

//    $('#myModal').modal(); {   keyboard: false   }
//    $('#testId').popover({content:"hello"});
//    $('#testId').popover('show');
//    $('#testId').tooltip('show');

//    // This hack is trigered when the doNothing is called first, it will prevent the pop up to pop when the inner edit icon is clicked
//    if ( $scope.allowModalToPopNextTime == false  ) {
//        $scope.allowModalToPopNextTime = true;
//        //act = 'edit'; // we could a different verw when the detailed view is called
//    }
//    else {
//        $scope.Modal.modalIsOpened = true;
//        $('#modalEnvoiTexte').modal('show');
//    }

// When selecting current text
//          $('#currentText').focus();
//          $('#currentText').select();
