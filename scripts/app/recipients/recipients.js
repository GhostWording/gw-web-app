// People we should communicate with more often !
// This is a static set for now
angular.module('app/recipients', [])

.factory('recipientsSvc', ['$q', function ($q) {
    var service = {

        getAll: function() {
            return $q.when([
                { "Id": "0", "Label": "Votre chérie" },
                { "Id": "1", "Label": "Votre chéri" },
                { "Id": "2", "Label": "Votre mère" },
                { "Id": "3", "Label": "Votre père" },
                { "Id": "8", "Label": "Une personne que vous souhaitez voir" },
                { "Id": "7", "Label": "Un(e) ami(e) perdu(e) de vue" },
                { "Id": "5", "Label": "Une personne qui aimerait des nouvelles" },
                { "Id": "6", "Label": "Une personne que vous devriez remercier" },
                { "Id": "4", "Label": "Quelqu'un qui a besoin de soutien" }
            ]);
        }
    };

    return service;
}])


.controller('RecipientListController', ['$scope', 'recipients', function ($scope, recipients) {

    $scope.lesQui = recipients;

}]);