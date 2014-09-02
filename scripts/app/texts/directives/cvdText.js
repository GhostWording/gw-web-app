angular.module('app/texts/cvdText', [])

// This is a one-off, one-directional binding for textList items
.directive('cvdText', ['helperSvc',function(helperSvc) {
  return {

    link: function(scope, element, attrs) {

      var txt = scope.$eval(attrs.cvdText);

//      if ( !txt.IsQuote ) {
        if ( !helperSvc.isQuote(txt) ) {

        element.html(txt.shortContent);
        element.addClass("well well-small bmw-texte");

      } else {

        var blockquote = angular.element('<blockquote>');

        var citation = angular.element('<span class="citation">');
        citation.html(txt.shortContent);
        blockquote.append(citation);

        if ( txt.Author && txt.Author != 'Inconnu'  ) {
          var author = angular.element('<small>');
          author.attr('title', txt.Author);
//          author.attr('class','citationFooter');
          author.text(txt.Author);
          blockquote.append(author);
        }

        element.append(blockquote);

      }
    }
  };
}]);