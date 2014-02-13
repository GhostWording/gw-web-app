// People we should communicate with more often !

cherryApp.factory('TypesDestinatairesStatiques', [function () {
    var typesDestinataires = {};
    typesDestinataires.query = function () {
        return [
            { "Id": "0", "Label": "Votre chérie" },
            { "Id": "1", "Label": "Votre chéri" },
            { "Id": "2", "Label": "Votre mère" },
            { "Id": "3", "Label": "Votre père" },
            { "Id": "8", "Label": "Une personne que vous souhaitez voir" },
            { "Id": "7", "Label": "Un(e) ami(e) perdu(e) de vue" },
            { "Id": "5", "Label": "Une personne qui aimerait des nouvelles" },
            { "Id": "6", "Label": "Une personne que vous devriez remercier" },
            { "Id": "4", "Label": "Quelqu'un qui a besoin de soutien" }
        ];
    };
    return typesDestinataires;
}]);