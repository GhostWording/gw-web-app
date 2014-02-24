angular.module('app/texts/cvdText', [])

// This is a one-off, one-directional binding for textList items
.directive('cvdText', [function() {
  return {

    link: function(scope, element, attrs) {

      var txt = scope.$eval(attrs.cvdText);

      if ( !txt.isQuote ) {

        element.html(txt.Content);

      } else {

        var blockquote = element('<blockquote>');

        var citation = angular.element('<span class="citation">');
        citation.html(txt.Content);
        blockquote.appendChild(citation);

        if ( txt.Author ) {
          var author = angular.element('<small>');
          author.attr('title', txt.Author);
          author.text(txt.Author);
          blockquote.appendChild(author);
        }

        element.appendChild(blockquote);

      }
    }
  };
}]);