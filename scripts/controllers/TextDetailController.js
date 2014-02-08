// Display text with author, link to the source, usage recommandations or comments

cherryApp.controller('TextDetailController', ['$scope','$routeParams', 'HelperService','SelectedText','SelectedIntention','AppLabels','SelectedArea',
function ($scope,$routeParams, HelperService,SelectedText,SelectedIntention,AppLabels,SelectedArea) {
    $scope.editText = false;

    var textId = $routeParams.textId;
    $scope.Id = textId;
    var areaId = $routeParams.areaId;

    SelectedArea.setSelectedAreaName(areaId);

    function displayIntentionLabel(data) {
      $scope.textDetailPageTitle = data.Label;
    }

    // TODO : do this on route change
    if ( !SelectedText.getSelectedTextObject() )
        SelectedText.readTextFromId(textId,areaId);

    // TODO : do this on route change
    var intentionId = $routeParams.intentionId;
    if ( !SelectedIntention.getSelectedIntention() )
        //SingleIntentionQuerySvc.query(intentionId, areaId);
        SelectedIntention.readIntentionFromId(areaId,intentionId);

    $scope.$watch(SelectedText.getSelectedTextObject,
        function(text) {
            if ( text ) {
                $scope.textToDetail = text.Content;
                $scope.source = text.ReferenceUrl;
                $scope.author = text.Author;
                $scope.isQuote = HelperService.isQuote(text);
                $scope.tagLabels = AppLabels.labelsFormTagIds(text.TagIds);
                if ( text.Abstract ) {
                    $scope.textDetailPageTitle = text.Abstract;
                }
            }
        }
    );

    $scope.$watch(SelectedIntention.getSelectedIntention,
        function(intention) {
            if ( intention && intention.Label ) {
                if ( $scope.textDetailPageTitle == undefined )
                    $scope.textDetailPageTitle = intention.Label;
            }
        }
    );


//    function setScopeVariables(text) {
//      $scope.textToDetail = text.Content;
//      $scope.source = text.ReferenceUrl;
//      $scope.author = text.Author;
//      $scope.isQuote = HelperService.isQuote(text);
//      $scope.tagLabels = AppLabels.labelsFormTagIds(text.TagIds);
//      setTextDetailPageTitle(text);
//    }



    $scope.send = function() {
      SelectedText.setSelectedTextLabel($scope.textToDetail);
      $scope.currentText.txt = SelectedText.getSelectedTextLabel();
      $scope.Modal.modalIsOpened = true;
      $('#modalEnvoiTexte').modal('show');
    };
    $scope.edit = function() {
      $scope.editText = true;
    };


  }]);