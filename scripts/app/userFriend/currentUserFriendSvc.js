angular.module('app/userFriend/currentUserFriendSvc', ['common/services/helperSvc'])

.factory('currentUserFriendSvc', ['helperSvc',
function (helperSvc) {
  var currentUserFriend;

  var service = {
    setCurrentUserFriend: function (uf) {
      currentUserFriend = uf;
      console.log("currentUserFriend set to " + currentUserFriend.name);
    },
    getCurrentUserFriend: function () {
      return currentUserFriend;
    },
    getCurrentUserFriendContext: function () {
      if ( !currentUserFriend )
        return '';
      return currentUserFriend.ufContext;
    }
  };

  return service;

}]);

