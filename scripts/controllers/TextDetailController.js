// Display text with author, link to the source, usage recommandations or comments

cherryApp.controller('TextDetailController', ['$scope','$routeParams', 'HelperService','SelectedText','SelectedIntention','AppLabels','SelectedArea',
function ($scope,$routeParams, HelperService,SelectedText,SelectedIntention,AppLabels,SelectedArea) {
    $scope.editText = false;

    var textId = $routeParams.textId;
    $scope.Id = textId;

    // TODO : do this on route change
    if ( !SelectedText.getSelectedTextObject() )
        SelectedText.readTextFromId(textId,$routeParams.areaName);

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