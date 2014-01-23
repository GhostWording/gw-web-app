// Returns labels for the current contry

cherryApp.factory('AppLabels', [function ()     {
    var country = 'fr';

    var o = {};

    o.labelsFormTagIds = function (tagIds) {
        var retval = [];
        for ( var i = 0; i < tagIds.length; i++ ) {
            var label = o.labelFromTagId(tagIds[i]);
            if ( label !== undefined && label !== '')
                retval.push(label);
        }
        return retval;
    };
    o.labelFromTagId = function(id) {
        var retval = '';
        switch (country)
        {
            case 'fr':
                switch (id) {
                    case 'CB38B9':
                        return 'Romantique';
                    case 'C91BCD':
                        return 'Démonstratif';
                    case '3337EE':
                        return 'Familier';
                    case '1A2DD5':
                        return 'Osé';
                    case '2968CB':
                        return 'Caustique';
                    case '43AC3B':
                        return 'Humoristique';
                    case '57B018':
                        return 'Décalé';
                    case 'FBC055':
                        return 'Tout simple';
                    case '8CC4E5':
                        return 'Imaginatif';
                    case '5EDC19':
                        return 'Chaleureux';
                    case '801BD9':
                        return 'Poétique';
                    case '13F241':
                        return 'Mélancolique';
                    default:
//                        console.log("id " + id + " not known"); // could be context tags
                        break;
                }
                break;
            case 'en':
                switch (id) {
                    case 'CB38B9':
                        return 'Romantic';
                    case 'C91BCD':
                        return 'Effusive';
                    case '3337EE':
                        return 'Ccolloquial';
                    case '1A2DD5':
                        return 'Racy';
                    case '2968CB':
                        return 'Caustic';
                    case '43AC3B':
                        return 'Humorous';
                    case '57B018':
                        return 'eccentric';
                    case 'FBC055':
                        return 'Simple';
                    case '8CC4E5':
                        return 'Imaginatif';
                    case '5EDC19':
                        return 'Friendly';
                    case '801BD9':
                        return 'Poetic';
                    case '13F241':
                        return 'Melancholic';
                    default:
                        console.log("id " + id + " not known");
                        break;
                }
                break;

            default :
                console.log("country " + country + " not known");
                break;
        }
        return retval;
    };

    o.f = function(id) {
        var retval = '';
        switch (country)
        {
            case 'fr':
                switch (id) {
                    case xx:
                        break;
                    default:
                        console.log("id " + id + " not known");
                        break;
                }
                break;
            default :
                console.log("country " + country + " not known");
                break;
        }
        return retval;
    };

    return o;

}]);