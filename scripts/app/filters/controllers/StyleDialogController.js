angular.module('app/filters/StyleDialogController', [])

.controller('StyleDialogController', ['$scope', 'contextStyles', 'generalStyles',
function ($scope, contextStyles, generalStyles) {
  $scope.generalStyles = generalStyles;
  $scope.contextStyles = contextStyles;

  $scope.updateStyle = function (styleCollection, style, isSelected) {
    if (isSelected) {
      styleCollection.addStyle(style);
    } else {
      styleCollection.removeStyle(style);
    }
  };

  $scope.styleLabels = {
    'humorous': 'Humoristique',
    'imaginative': 'Imaginatif',
    'poetic': 'Poétique',
    'citation': 'Avec citation',
    'simple': 'Tout simple'
  };
  $scope.contextStyleLabels = {
    'administrativeContext': 'Administratif',
    'familialContext': 'Familial',
    'romanticContext': 'Amoureux',
    'friendlyContext': 'Amical',
    'proContext': 'Professionnel'
  };

  $scope.nbTextLabel = $scope.filteredList.length > 1 ? "textes" : "texte";
}]);