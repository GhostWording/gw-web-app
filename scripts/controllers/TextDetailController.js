// Display text with author, link to the source, usage recommandations or comments

cherryApp.controller('TextDetailController', ['$scope','$routeParams', 'HelperService','SelectedText','SelectedIntention','SingleIntentionQuerySvc','AppLabels','PostActionSvc','SelectedArea',
  function ($scope,$routeParams, HelperService,SelectedText,SelectedIntention,SingleIntentionQuerySvc,AppLabels,PostActionSvc,SelectedArea) {
    $scope.editText = false;

    var textId = $routeParams.textId;
    $scope.Id = textId;
    var areaId = $routeParams.areaId;

    SelectedArea.setSelectedAreaName(areaId);

    function displayIntentionLabel(data) {
      $scope.textDetailPageTitle = data.Label;
    }

    function setTextDetailPageTitle (text) {
      var textAbstractOrIntentionLable;
      var currentIntention = SelectedIntention.getSelectedIntention();
      if ( text !== undefined && text.Abstract !== undefined )
        textAbstractOrIntentionLable = text.Abstract;
      else if ( currentIntention !== undefined )
        textAbstractOrIntentionLable = currentIntention.Label;

      if ( textAbstractOrIntentionLable !== undefined ) {
        $scope.textDetailPageTitle = textAbstractOrIntentionLable;
      }
      else {
         SingleIntentionQuerySvc.query(text.IntentionId,areaId,displayIntentionLabel);
      }

    }

    function setScopeVariables(text) {
      $scope.textToDetail = text.Content;
      $scope.source = text.ReferenceUrl;
      $scope.author = text.Author;
      $scope.isQuote = HelperService.isQuote(text);
//            $scope.tags = filterTags(text.Tags,'style');
      $scope.tagLabels = AppLabels.labelsFormTagIds(text.TagIds);
      setTextDetailPageTitle(text);
    }

    var txt = SelectedText.getSelectedTextObject();
    if ( txt !== undefined ) {
      setScopeVariables(txt);
    }
    else
      txt = SelectedText.readTextFromId(textId,areaId,doIfTextSuccessfullyReadFromId);

    function doIfTextSuccessfullyReadFromId(text) {
      SelectedText.setSelectedTextLabel(text.Content);
      SelectedText.setSelectedTextObject(text);
      setScopeVariables(text);
    }

    $scope.isQuote = HelperService.isQuote(txt);
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