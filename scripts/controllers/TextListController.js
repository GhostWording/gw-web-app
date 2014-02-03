// Displays a list of texts
cherryApp.controller('TextListController',
 ['$scope', '$filter','$routeParams','$location', 'NormalTextFilters', 'SelectedText', 'SelectedIntention', 'TheTexts', 'AppUrlSvc', 'HelperService','SingleIntentionQuerySvc','PostActionSvc','SelectedArea','TextFilterHelperSvc','FilterVisibilityHelperSvc',
function ($scope, $filter, $routeParams,$location,  TextFilters,SendText,SelectedIntention, TheTexts, AppUrlSvc, HelperSvc,SingleIntentionQuerySvc,PostActionSvc,SelectedArea,TextFilterHelperSvc,FilterVisibilityHelperSvc) {
    $scope.PostBox = PostActionSvc;

    $scope.areaId = $routeParams.areaId;
    $scope.intentionId = $routeParams.intentionId;

    // if only one parameter, it's a slug shortcut that implies both area and intention
    var intentionSlug = $routeParams.intentionSlug;
    var badRoute = false;
    if (intentionSlug !== undefined) {
        switch (intentionSlug) {
            case 'BonneAnnee':
                $scope.areaId = 'Important';
                $scope.intentionId = '938493';
                break;
            default:
                console.log('Unknown intentionSlug ' + intentionSlug);
                badRoute = true;
                break;
        }
    }
    // Change to root if shortcup slug unknown
    if ( badRoute ) {
        $location.url('/');
        return;
    }
    // Initialize list of texts to be displayed
    $scope.TextListPanel = {};
    $scope.TextListPanel.lesTextes = [];
    $scope.TextListPanel.showNbTexts = false; // 23 nov

    // Read area and intention id from url
    SelectedIntention.setSelectedIntentionId($scope.intentionId);
    SelectedArea.setSelectedAreaName($scope.areaId);

    var intention = SelectedIntention.getSelectedIntention();
    if (intention !== undefined)
        $scope.TextListPanel.intentionLabel = intention.Label;

    //Previously moved after text loadeding query : not necessary, bug found
    if (intention === undefined)
        ReadAndDisplayIntention($scope.intentionId);
    // Initialize display
    doBeforeReadingTexts();

    // Unless the texts are already cached, read the first few texts from the server to display something quickly
    if (!TheTexts.textsAlreadyCachedForIntention($scope.intentionId)) {
        TheTexts.resetTexts();
        // If there are many texts, we could load the 7 first texts so the user sees something quickly, complete list query could then be lanched from doIfFirstTextsRead
//      TheTexts.queryTexts(intentionId, $scope.areaId,  doIfFirstTextsRead,doIfErrorReadingTexts, false, 7);
        TheTexts.queryTexts($scope.intentionId, $scope.areaId, doIfAllTextsRead, doIfErrorReadingTexts, true);
    }
    // if texts are cached they won't be fetched from the server
    else
        TheTexts.queryTexts($scope.intentionId, $scope.areaId, doIfAllTextsRead, doIfErrorReadingTexts, true);

    // Change filtered text list (and TextCount) each time TextFilters change
    $scope.filters = TextFilters.filterValuesToWatch;

    var isFirstWriteChangeCall = true;
    var writeChange = function (){
      if ( isFirstWriteChangeCall )
        isFirstWriteChangeCall = false;
      else
        filterAndReorder(TheTexts, TextFilters);
    };
    $scope.$watch('filters()',writeChange,true);

    function filterAndReorder(TheTexts, TextFilters) {
      // Exclude texts not matching tags and properties
      $scope.TextListPanel.lesTextes = TheTexts.filterAndReorder(TextFilters);
      return $scope.TextListPanel.lesTextes;
    }

    // Reordering the texts can be long, don't do it the first time, it will have been done while reading the texts
    var isFirstReorderTextsCall = true;
    var reorderTexts = function() {
      // Filters should be reaplied
      if ( isFirstReorderTextsCall )
        isFirstReorderTextsCall = false;
      else {
          var t = filterAndReorder(TheTexts, TextFilters);
          TheTexts.cacheReorderedTexts(t, $scope.intentionId);
      }

    };
    //$scope.preferedTags = TextFilters.preferedValuesToWatch;
    //$scope.$watch('preferedTags()',reorderTexts,true);
    $scope.$watch(TextFilters.preferedValuesToWatch,reorderTexts,true);

    // Initialize display while we fetch the texts
    function doBeforeReadingTexts ()  {
      // Show a progress bar trying to grow
      $scope.TextListPanel.showProgressBar = true;
      $scope.TextListPanel.progressBarWidth = 60;
    }
    // What do we do after the first few texts have been preloaded
    function doIfFirstTextsRead(data) {
      // Show some progress on the progress bar
      $scope.TextListPanel.progressBarWidth = 70;
      // Populate list of texts.
      $scope.TextListPanel.lesTextes = TextFilterHelperSvc.filterOnBasicFilters(data,TextFilters );
      // Fetch complete list from the server
      TheTexts.queryTexts($scope.intentionId, $scope.areaId,  doIfAllTextsRead,doIfErrorReadingTexts, true);
    }

    // Whate do we do when complete text list is read
    function doIfAllTextsRead(data) {
      // Briefly show a full progress bar then hide ti
      $scope.TextListPanel.progressBarWidth = 100;
      $scope.TextListPanel.showNbTexts = true;
      $scope.TextListPanel.labelNbTexts = "façons de dire";
      $scope.TextListPanel.showProgressBar = false;

      var txtList = TextFilterHelperSvc.filterOnBasicFilters(data,TextFilters );
      $scope.TextListPanel.lesTextes = txtList;
    }

    function doIfErrorReadingTexts  ()  {
      // switch message to failure
      $scope.TextListPanel.labelNbTexts = "Aucun texte pour dire";
      // hide other controls
      $scope.TextListPanel.showNbTexts = true;
      $scope.TextListPanel.progressBarWidth = 100;
    }

    $scope.allowModalToPopNextTime = true;
    $scope.selectAndPopUp = function(txt,action) {
      $scope.allowModalToPopNextTime = true;
      $('#modalEnvoiTexte').modal('show');
      $scope.selectThisText(txt,action);
      PostActionSvc.postActionInfo("Text",txt.TextId,"TextList", "send" );
      return false; // true
    };

    $scope.selectThisText = function (txt,action) {
      var id = txt.TextId;

      SendText.setSelectedTextLabel(txt.Content);
      SendText.setSelectedTextObject(txt);
      $scope.currentText.txt = SendText.getSelectedTextLabel();
      $scope.currentText.id = id;
      PostActionSvc.postActionInfo.postActionForText($scope.intentionId,id,'view'); // Old
    };

    $scope.getSelectedTextId = function(txt,id) {
      return SendText.getTextId();
    };

    // Hack : Because doNothing is called before selectThisText, we can prevent popup from showing
    $scope.doNothing = function () {
      $scope.allowModalToPopNextTime = false;
      return false;
    };

    $scope.calculateFilterContextTargets = function () {
      TextFilters.setDialogIsDisplayed(true);
    };

    // Only show texts when filters are fully set up
    $scope.hideTexts = function () {
      var recipientDefined = TextFilters.getHideRecipientGender();
      var tuOuVousDefined = TextFilters.getHideTuOuVous();
//      var closenessDefined = TextFilters.getHideCloseness();
      return  !(recipientDefined && tuOuVousDefined) ;
    };

    function ReadAndDisplayIntention(id) {
        function doIfIntentionRead(data) {
            $scope.TextListPanel.intentionLabel = data.Label;
            SelectedIntention.setSelectedIntention(data);
        }
      SingleIntentionQuerySvc.query(id,$scope.areaId,doIfIntentionRead);
    }

    // We may want to display the title, the text, or the text as a quote
    $scope.whatToDisplay = function (txt) {
        if (SelectedArea.wantsToDisplayTextTitles())
            return HelperSvc.TxtDisplayModeEnum.Abstract;
        else
            return HelperSvc.shouldDisplayAsCitation(txt);
    };

    // Only display filters for texts of the standard intention area
    $scope.displayTextFilters = function () {
        return SelectedArea.wantsToDisplayTextFilters();
    };

    $scope.choseFiltersToDisplay = function() {
        FilterVisibilityHelperSvc.setContextFiltersVisibility(TheTexts.getAllTexts());
      $('#modalFiltres').modal('show');
    };

  }
]);

// OLD CODE
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
