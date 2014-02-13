// Boite permettant d'afficher un text et de l'envoyer
cherryApp.controller('RecipientListController', ['$scope', '$filter', 'TypesDestinatairesStatiques', function ($scope, $filter, Recipients) {

    $scope.lesQui = Recipients.query();

}]);