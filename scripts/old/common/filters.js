
// Remplace [ with "
cherryApp.filter('replaceBrackets', function () {
    return function (input) {
      if ( input === undefined || input === null )
         return input;
        var out = input.replace('[', '"');
        out = out.replace(']', '" ');
        return out;
        };
    });

// Remplace \n and \r mixtures with <br>
cherryApp.filter('convertEndOfLineToBR', function() {
  return function(input ) {
    if ( input === undefined || input === null ) {
      return input;
    }
    var out = input.replace('\r\n', '\n');
    out = out.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
    out = out.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
    return out;
  };
});

// Create new displayable htmlContent property  created from content property
cherryApp.filter('GenerateHtmlFields',['$filter','$sce', function ($filter,$sce) {
    return function (input) {
        var out = [];
        for (var i = 0; i < input.length; i++) {
            var currentText = input[i];
            if (!currentText || !currentText.Target) {
                console.log("erreur dans RemplacerRetoursLigne pour texte " + i);
                continue;
            }
            var c1 =  ($filter)('replaceBrackets')(currentText.Content);
            var c2 =  ($filter)('convertEndOfLineToBR')(c1);

            var maxTextLengthForTextListRendering = 400;
            if ( c2.length > maxTextLengthForTextListRendering ) {
                c2 = c2.substring(0, maxTextLengthForTextListRendering) + "...<span class='glyphicon glyphicon-hand-right'></span>";
            }
            currentText.htmlContent = c2;

            // Check this property to decide cached text should be refreshed from the server
            currentText.cacheFormatVersion = 1;


            //currentText.htmlContent = $sce.trustAsHtml(c2); // does not seem to improve performance

            var a1 =  ($filter)('replaceBrackets')(currentText.Abstract);
            var a2 =  ($filter)('convertEndOfLineToBR')(a1);
            currentText.htmlAbstract = a2;

//            var result =  currentText.Content ;
//            result = result.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
//            result = result.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
//            currentText.HtmlContent =   result;

            out.push(currentText);
        }
        return out;
    };
}]);



function isTextTaggedWithId(text,tagId) {
    var tagIsPresent = false;
    for (var j = 0; j < text.TagIds.length; j++)
    {
        if ( text.TagIds[j] == tagId )
        {
            tagIsPresent = true;
            break;
        }
    }
    return tagIsPresent;
}


// Sort and filter intentions, typically by intention area
var filterTags = function (tags,type) {
    var retval = [];
    angular.forEach(tags,
        function (t) {
            if ( t.Type == type )
                retval.push(t);
        });
    return retval;
};

 // Filtre de test
cherryApp.filter('OrderByPremiereLettre', function ($filter) {
    var monFiltre = function (input, trierPar) { return $filter('orderBy')(input, trierPar); };
    return monFiltre;
});

// Trier par SortOrder en mettant les 0 en dernière position
cherryApp.filter('OrderBySortOrderExceptFor0', function () {
    var monFiltre = function (input) {
        input.sort(
            function (a, b) {
                var aSortOrder = a.SortBy;
                var bSortOrder = b.SortBy;
                if (aSortOrder === 0 && bSortOrder !== 0)
                    return 1;
                if (bSortOrder === 0 && aSortOrder !== 0)
                    return -1;
                return (aSortOrder - bSortOrder);
            });
    };
    return monFiltre;
});

// Ancienne version pour une liste de textes
// TODO : remplacer les crochets sur le serveur
cherryApp.filter('RemplacerCrochets', function () {
  return function (input) {
    var out = [];
    for (var i = 0; i < input.length; i++) {
      var currentText = input[i];
      if (!currentText || !currentText.Target) {
        console.log("erreur dans RemplacerCrochets pour texte " + i);
        continue;
      }
      currentText.Content = currentText.Content.replace('[', '"');
      currentText.Content = currentText.Content.replace(']', '" ');
      out.push(currentText);
    }
    return out;
  };
});


