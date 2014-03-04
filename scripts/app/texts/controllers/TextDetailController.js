angular.module('app/texts/TextDetailController', ['common/i18n'])

// Display text with author, link to the source, usage recommandations or comments

.controller('TextDetailController', ['$scope','currentText', 'currentIntention', 'currentArea', 'tagLabelsSvc', '$modal',
function ($scope, currentText, currentIntention, currentArea, tagLabelsSvc, $modal) {

  currentText.TagLabels = tagLabelsSvc.labelsFromTagIds(currentText.TagIds);

  $scope.currentArea = currentArea;
  $scope.currentIntention = currentIntention;
  $scope.currentText = currentText;

  // Copy the text Content so that if we edit it we are not editing the original "text".
  $scope.editableText = currentText.Content;

  // $scope.source = text.ReferenceUrl;

  $scope.send = function() {
    $scope.sendDialog = $modal.open({
      templateUrl: 'views/partials/sendTextForm.html',
      scope: $scope,
      controller: 'SendTextFormController'
    });
  };


  $scope.editText = false;
  $scope.edit = function() {
    $scope.editText = true;
  };


}]);