cherryApp.controller('TextListController',
    ['$scope', '$filter','$routeParams','$location', 'NormalTextFilters', 'SelectedText', 'SelectedIntention', 'TheTexts', 'AppUrlSvc', 'HelperService','SingleIntentionQuerySvc','PostActionSvc','SelectedArea',
	function ($scope, $filter, $routeParams,$location,  TextFilters,SendText,SelectedIntention, TheTexts, AppUrlSvc, HelperSvc,SingleIntentionQuerySvc,PostActionSvc,SelectedArea) {
        $scope.PostBox = PostActionSvc;

        // When in this view, we want to see the navigation tags
        $scope.Tabs.showTabs = true;

        // List of texts to be displayed
        $scope.TextListPanel = {};
        $scope.TextListPanel.lesTextes = [];
        $scope.TextListPanel.showNbTexts = false; // 23 nov

        $scope.areaId = $routeParams.areaId;
        var intentionId = $routeParams.intentionId;

        // if only one parameter, it will be a slug that derives both area and intention
        var intentionSlug =  $routeParams.intentionSlug;
        if ( intentionSlug != undefined )
        {
            switch (intentionSlug) {
                case 'BonneAnnee':
                    $scope.areaId = 'Important';
                    intentionId = '938493';
                    break;
                default:
                    console.log('Unknown intentionSlug ' + intentionSlug);
                    $location.url('/'); // move to root
                    break;
            }
        }

        // Read area and intention id from the url
		console.log('TextListController for intention ' + intentionId );
        SelectedIntention.setSelectedIntentionId(intentionId);
        SelectedArea.setSelectedAreaName($scope.areaId);

        $scope.Tabs.tabNumber = SelectedArea.getTabNumberForArea($scope.areaId);

        var intention = SelectedIntention.getSelectedIntention();
		if (intention != undefined )
			$scope.TextListPanel.intentionCourante = intention.Label;
//        Moved after text loadeding query to avoid possible bug when both queries run together
//        if (intention == undefined ) ReadAndDisplayIntention();

		// Initialize display
		doBeforeReadingTexts();
		// Unless the texts are already cached, read the first few texts from the server to display something quickly
		if ( ! TheTexts.textsAlreadyCachedForIntention(intentionId) ) {
			TheTexts.resetTexts();
            // We may want to load the 7 firt texts so the user sees something quickly, complete list query will then be lanched from doIfFirstTextsRead
//			TheTexts.queryTexts(intentionId, $scope.areaId,  doIfFirstTextsRead,doIfErrorReadingTexts, false, 7);
            TheTexts.queryTexts(intentionId, $scope.areaId, doIfAllTextsRead,doIfErrorReadingTexts, true);
		}
        // if texts are cached there won't be a query, they will be waiting for us
		else
			TheTexts.queryTexts(intentionId, $scope.areaId, doIfAllTextsRead,doIfErrorReadingTexts, true);

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
            var texts = TheTexts.filterCurrentTextList(TextFilters);

            // Randomize order
            texts = HelperSvc.shuffleTextIfSortOrderNotLessThan(texts, TheTexts.getMinSortOrderToGetShuffled());

            // Reorder using favorite tags
            TheTexts.reorderUsingPreferedFilters(texts, TextFilters);
            // Display
            $scope.TextListPanel.lesTextes = texts;
        }

        var isFirstReorderTextsCall = true;
        var reorderTexts = function() {
            // Filters should be reaplied
//            filterAndReorder(TheTexts, TextFilters);
            if ( isFirstReorderTextsCall )
                isFirstReorderTextsCall = false;
            else
                filterAndReorder(TheTexts, TextFilters);

        };
        //$scope.preferedTags = TextFilters.preferedValuesToWatch;
        //$scope.$watch('preferedTags()',reorderTexts,true);
        $scope.$watch(TextFilters.preferedValuesToWatch,reorderTexts,true);


        // Initialize display while we fetch the texts
        function doBeforeReadingTexts ()  {
			// Show a progress bar trying to grow
			$scope.TextListPanel.showProgressBar = true;
			$scope.TextListPanel.progressBarWidth = 60;
            // Dont show the number of texts yet
			// $scope.TextListPanel.showNbTexts = false; // 22 nov 2013 : moved progress bar, show nb text always
		}
        // What do we do after the first few texts have been preloaded
		function doIfFirstTextsRead(data) {
			// Show some progress on the progress bar
			$scope.TextListPanel.progressBarWidth = 70;

//          25 septembre : commented 3 line so that displayed info look more stable
//			$scope.TextListPanel.showNbTexts = true;
//			$scope.TextListPanel.labelNbTexts = "...";
//			$scope.TextListPanel.showProgressBar = false;

			// Populate list of texts.
			$scope.TextListPanel.lesTextes = TheTexts.filterOnBasicFilters(data,TextFilters );

			// Fetch complete list from the server
			TheTexts.queryTexts(intentionId, $scope.areaId,  doIfAllTextsRead,doIfErrorReadingTexts, true);
		}

		// Whate do we do when complete text list is read
		function doIfAllTextsRead(data) {
			// Briefly show a full progress bar then hide ti
			$scope.TextListPanel.progressBarWidth = 100;
			$scope.TextListPanel.showNbTexts = true;
			$scope.TextListPanel.labelNbTexts = "façons de dire";
			$scope.TextListPanel.showProgressBar = false;

			var txtList = TheTexts.filterOnBasicFilters(data,TextFilters );
			$scope.TextListPanel.lesTextes = txtList;

            if (intention == undefined ) {
                $scope.TextListPanel.intentionCourante = "...";
                ReadAndDisplayIntention(intentionId);
            }
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

//            $('#myModal').modal();

//            {
//                keyboard: false
//            }

            $scope.selectThisText(txt,action)
//            return true;
            return false;
        };

//        $('#testId').popover({content:"hello"});

//        $('#testId').popover('show');
        $('#testId').tooltip('show');



        $scope.selectThisText = function (txt,action) {
//            var id = txt.Id;
            var id = txt.TextId;

            SendText.setSelectedTextLabel(txt.Content);
            SendText.setSelectedTextObject(txt);
            $scope.currentText.txt = SendText.getSelectedTextLabel();
//			$('#currentText').focus();
//			$('#currentText').select();

            var act = 'view';
//            // This hack is trigered when the doNothing is called first, it will prevent the pop up to pop when the inner edit icon is clicked
//            if ( $scope.allowModalToPopNextTime == false  ) {
//                $scope.allowModalToPopNextTime = true;
//                //act = 'edit'; // we could a different verw when the detailed view is called
//            }
//            else {
//                $scope.Modal.modalIsOpened = true;
//                $('#modalEnvoiTexte').modal('show');
//            }
            PostActionSvc.postActionForText(intentionId,id,action); // Old

//            var actionToSend = action == 'send' ? action : 'click';
            var actionToSend = action == 'send' ? action : 'open';

            $scope.PostBox.gulp('Text',id ,'TextList', actionToSend);
        };

        $scope.getSelectedTextId = function(txt,id) {
            var retval = SendText.getTextId();
            return retval;
        };

        $scope.doNothing = function () {
            // Hack : Because doNothing is called before selectThisText, we can prevent popup from showing
            $scope.allowModalToPopNextTime = false;
            return false;
        };

        $scope.calculateFilterContextTargets = function () {
          TextFilters.setDialogIsDisplayed(true);
        };

        // Only show texts when filters are fully set up
        $scope.hideTexts = function () {
//            return !TextFilters.getHideRecipientGender() && !TextFilters.getHideCloseness() && !TextFilters.getHideTuOuVous() ;
            var recipientDefined = TextFilters.getHideRecipientGender();
            var closenessDefined = TextFilters.getHideCloseness();
            var tuOuVousDefined = TextFilters.getHideTuOuVous();
//            return  !(recipientDefined && closenessDefined && tuOuVousDefined) ;
            return  !(recipientDefined && tuOuVousDefined) ;
        };


        function doIfIntentionRead(data) {
            $scope.TextListPanel.intentionCourante = data.Label;
            SelectedIntention.setSelectedIntention(data);
        }
		function ReadAndDisplayIntention(id) {
            SingleIntentionQuerySvc.query(id,$scope.areaId,doIfIntentionRead);
		}
	    // For texts of the formalities area, only display the titles of the texts
		$scope.displayTitle = function () {
		    return $scope.areaId == 'A4FAEF70-5A7D-4ECF-A2E6-C19375991E1A';
		};

        // Should we display the text or an abstract
        $scope.whatToDisplay = function(txt) {
            // For formalities, display abstracts instead of full texts
            if ( $scope.areaId == 'A4FAEF70-5A7D-4ECF-A2E6-C19375991E1A' )
                return HelperSvc.TxtDisplayModeEnum.Abstract;
            else
                return $scope.shouldDisplayAsCitation(txt);
        };

        // Is it a quote ?
        $scope.shouldDisplayAsCitation = function(txt) {
            return HelperSvc.shouldDisplayAsCitation(txt);
        };

	    // Only display filters for texts of the standard intention area
		$scope.displayTextFilters = function () {
//		    return areaId == 'D4A6129A-E51E-4B4E-9BAE-66ABC2FDD7AF';
            return $scope.areaId !=  'A4FAEF70-5A7D-4ECF-A2E6-C19375991E1A';
		};
		$scope.displayTextCount = function () {
//            return $scope.displayTextFilters();
            return $scope.TextListPanel.showNbTexts;
		};

        $scope.choseFiltersToDisplay = function() {
            console.log('choseFiltersToDisplay');
            TheTexts.setContextFiltersVisibility();
            $('#modalFiltres').modal('show');
        };

	}
]);