angular.module('app/userFriend/userFriendsSvc', ['common/services/HelperSvc'])

.factory('userFriendsSvc', ['HelperSvc',
  function (HelperSvc) {
    var allUserFriends = [];
    var famillyUserFriends = [];

    var service = {
      setAllUserFriends: function (ufList) {
        allUserFriends = ufList;
        console.log("allUserFriends length : " + allUserFriends.length);
      },
      getAllUserFriends: function () {
        return allUserFriends;
      },
      setFamilyUserFriends: function (ufList) {
        famillyUserFriends = ufList;
        console.log("famillyUserFriends length : " + famillyUserFriends.length);
      },
      getFamilyUserFriends: function () {
        return famillyUserFriends;
      },

    };

    return service;

  }]);
