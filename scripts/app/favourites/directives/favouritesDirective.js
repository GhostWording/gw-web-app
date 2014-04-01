angular.module('app/favourites/favouritesDirective', [])

.directive('favouriteToggle', [function() {
    return {
      restrict: 'EA',
      replace: true,
      template: '<span class="pull-right favourite fa fa-lg fa-star"' +
                'ng-class="{' +
                '\'fa-star-o\': !isFavourite(txt)}"' +
                'ng-click="setFavourite(txt, isFavourite(txt))"' +
                '></span>',
      scope: {
        txt: '=',
        isFavourite: '&',
        setFavourite: '&onChange'
      }
    };
  }]);