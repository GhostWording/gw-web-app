// Boite permettant d'afficher un text et de l'envoyer
cherryApp.controller('RecipientListController', ['$scope', '$filter', 'TypesDestinatairesStatiques', function ($scope, $filter, Recipients) {

    console.log('RecipientListController');

    $scope.Tabs.showTabs = true;


    $scope.Tabs.tabNumber = 2;

    $scope.lesQui = Recipients.query();

}]);