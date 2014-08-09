angular.module('app/userFriend/currentUserFriendSvc', ['common/services/HelperSvc'])

.factory('currentUserFriendSvc', ['HelperSvc',
function (HelperSvc) {
  var currentUserFriend;

  var service = {
    setCurrentUserFriend: function (uf) {
      currentUserFriend = uf;
      console.log("currentUserFriend set to " + currentUserFriend.name);
    },
    getCurrentUserFriend: function () {
      return currentUserFriend;
    }
  };

  return service;

}]);

