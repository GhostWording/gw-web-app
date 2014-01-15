
// Remplace [ with "
cherryApp.filter('replaceBrackets', function () {
    return function (input) {
	    if ( input == undefined )
	       return input;
        var out = input.replace('[', '"');
        out = out.replace(']', '" ');            
        return out;
        };
    });

// Remplace \n and \r mixtures with <br>
cherryApp.filter('convertEndOfLineToBR', function() {
	return function(input) {
		if ( input == undefined )
			return input;
		var out = input.replace('\r\n', '\n');
		out = out.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
		out = out.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
		return out;
		}
	});


//function convertStyleNameToGuid(name) {
//    var retval = undefined;
//
//    switch(name) {
//        // Style tags
//        case 'romantic':
//            retval = 'CABFC6FD-2EAA-4717-AEF5-E48A78D5DA11';
//            break;
//        case 'effusive':
//            retval = 'BDEE428A-8410-419A-80D1-6BA94A5170C6';
//            break;
//        case 'colloquial':
//            retval = 'B158ABE8-132C-43AC-8B5A-1BF7BAB127ED';
//            break;
//        case 'racy':
//            retval = '4D1B62E5-7329-419A-8592-FD190EBDE1DF';
//            break;
//        case 'ambiguous':
//            retval = 'DC138BE0-5F63-4105-BBF8-762294D669F0';
//            break;
//        case 'caustic':
//            retval = 'C4A0C492-51BF-450F-A6A8-4CF1F3AEC020';
//            break;
//        case 'humorous':
//            retval = 'D9149DEA-E8EC-4EFA-B8B2-B381BFE0E059';
//            break;
//        case 'eccentric':     // quirky //  // cranky
//            retval = 'CB7A5422-D0B6-46ED-9ED9-D7B7981B73E9';
//            break;
//        case 'simple':       // straightforward
//            retval = '1B81A05D-066B-48B8-B35A-99101ADB9018';
//            break;
//        case 'formal':
//            retval = '25C18FEE-B07A-4096-A315-E4BC1FE10667';
//            break;
//        case 'citation':
//            retval = 'C8F151F2-F8D6-4F94-A45E-2C7E515E294E';
//            break;
//        case 'imaginative':
//            retval = 'CB7A5422-D0B6-46ED-9ED9-D7B7981B73E9';
//            break;
//        case 'friendly':
//            retval = '79690CD8-4616-4E3A-A46D-948A30D6A645';
//            break;
//        case 'poetic':
//            retval = 'BCD307D7-53E6-4FAA-80A9-F7CE7C49109B';
//            break;
//        case 'melancholic':
//            retval = 'D63125C9-8F0E-4BCE-BD34-C68CAEA3E566';
//            break;
//        // Context tags
//        case 'administrativeContext':
//            retval = '47793a6c-3b20-4897-b3d5-f65c5772530e';
//            break;
//        case 'familialContext':
//            retval = '4c98736a-a176-4af8-ac85-726cb7a9a3a3';
//            break;
//        case 'inLoveContext':
//            retval = '4e31d380-737c-4888-9dba-1fdedb59f31f';
//            break;
//        case 'datingContext':
//            retval = '83ca88c2-800c-4c55-ac0a-43a8a9a38ba3';
//            break;
//        case 'coupleContext':
//            retval = 'c4edd2c0-ed31-4e57-a9a4-9d0611ce8502';
//            break;
//        case 'friendlyContext':
//            retval = 'f5960eaa-f457-4089-96e1-99624d41aadf';
//            break;
//        case 'professionalContext':
//            retval = 'fe3de9d8-d7f6-441d-8da0-17263fc6a9b4';
//            break;
//    };
//
//    return retval;
//}
//
//// Converts the properties of the styleListObject to a list of Guids that can be matched by text tags
//function getIdsOfTagsWithTrueValue(styleListObject) {
//    var idsToExclude = [];
//    for (var propertyname in styleListObject) {
//        // if the property exists and its value is true, push the corresponding guid in the list
//        if (styleListObject[propertyname] == true) {
//            var guid = convertStyleNameToGuid(propertyname);
//            if (guid != undefined)
//                idsToExclude.push(guid);
//            else
//                console.log("tag id not found for " + propertyname);
//        }
//    }
//    return idsToExclude;
//}

//function areExcludedStylesCompatible(styleListObject,text) {
//    var retval = true;
//    // Make a list of guids from the nmame of the tags chosen by user for exclusion
//    var idsToExclude = getIdsOfTagsWithTrueValue(styleListObject);
//    // For each tag the user wants to exclude, return false if it is present in the tags of the text
//    for (var i = 0; i < idsToExclude.length; i++)
//    {
//        if ( isTextTaggedWithId(text,idsToExclude[i]) )
//        {
//            retval = false;
//            break;
//        }
//    }
//    return retval;
//}
//
//function areIncludedContextsCompatible(contextListObject,text) {
//    // Make a list of guids from the nmame of the tags chosen by user for exclusion
//    var idsToInclude = getIdsOfTagsWithTrueValue(contextListObject);
//    // if no context defined, no need to match a choice
//    if ( idsToInclude == undefined || idsToInclude.length == 0)
//        return true;
//
//    var retval = false;
//    // If we match any tag we want to include, return true if it is present in the tags of the text
//    for (var i = 0; i < idsToInclude.length; i++)
//    {
//        if ( isTextTaggedWithId(text,idsToInclude[i]) )
//        {
//            retval = true;
//            break;
//        }
//    }
//    return retval;
//}


function isTextTaggedWithId(text,tagId) {
    var tagIsPresent = false;
//    for (var j = 0; j < text.Tags.length; j++)
    for (var j = 0; j < text.TagIds.length; j++)
    {
//        if ( text.Tags[j].Id == tagId )
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


// Ancienne version pour une liste de textes
cherryApp.filter('RemplacerRetoursLigne', function () {
	return function (input) {
		var out = [];
		for (var i = 0; i < input.length; i++) {
			var currentText = input[i];
			if (!currentText || !currentText.Target) {
				console.log("erreur dans RemplacerRetoursLigne pour texte " + i);
				continue;
			}
			//var textWithNormalizedLineBreaks = currentText.Content.replace('\r\n', '\n');


			//var result = "<p>" + currentText.Content + "</p>";
			var result =  currentText.Content ;

			result = result.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
			result = result.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");

			//currentText.Content =   result;
			currentText.HtmlContent =   result;
			out.push(currentText);
		}
		return out;
	};
});
