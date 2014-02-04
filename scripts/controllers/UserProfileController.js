// Displays user profile and usage options for our App
cherryApp.controller('UserProfileController', ['$scope', 'HelperService', 'UserProfileSvc','$cookies',
	function ($scope, HelperService,UserProfileSvc,$cookies) {
        $scope.UserProfile = UserProfileSvc;

//		console.log('$cookies.UserGender ' + $cookies.UserGender);
//		console.log('$cookies.UserReadsALot ' + $cookies.UserReadsALot);
//		console.log('$cookies.UserAge ' + $cookies.UserAge);
//		console.log('$cookies.UserIsDemonstrative ' + $cookies.UserIsDemonstrative);
	}]);