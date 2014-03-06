angular.module('app/filters/StyleDialogController', [])

.controller('StyleDialogController', ['$scope', 'contextStyles', 'generalStyles',
  function ($scope, contextStyles, generalStyles) {

        $scope.generalStyles = generalStyles;
        $scope.contextStyles = contextStyles;

        $scope.updateStyle = function(styleCollection, style, isSelected) {
            if ( isSelected ) {
                styleCollection.addStyle(style);
            } else {
                styleCollection.removeStyle(style);
            }
        };

        $scope.styleLabels = {
            'humorous':  'Humoristique',
            'imaginative': 'Imaginatif',
            'eccentric': 'Décalé',
            'poetic': 'Poétique',
            'citation': 'Avec citation',
            'simple': 'Tout simples',
        };

        $scope.TogglePreferedStyle = function(key,scopeVariable) {
            var newValue = ! $scope[scopeVariable];
            TextFilters.setStyleToPrefer(key,newValue);
            PostActionSvc.postActionInfo('Command',scopeVariable,'StyleDialog','click',newValue);
        };

        $scope.ToggleIncludeContext = function(key,scopeVariable) {
            var newValue = ! $scope.ContextFilters[scopeVariable];
            TextFilters.setContextToInclude(key,newValue);
            PostActionSvc.postActionInfo('Command',key,'StyleDialog','click',newValue);
        };

    }]);