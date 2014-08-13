angular.module('app/userFriend/userFriendsSvc', ['common/services/HelperSvc'])

.factory('userFriendsSvc', ['HelperSvc',
  function (HelperSvc) {
    var allUserFriends = [];
    var famillyUserFriends = [];
    var birthdayUserFriends = [];

    var service = {
      setUFList: function (ufList) {
        allUserFriends = ufList;
        console.log("allUserFriends length : " + allUserFriends.length);
      },
      getUFList: function () {
        return allUserFriends;
      },
      setFamilyUserFriends: function (ufList) {
        famillyUserFriends = ufList;
        console.log("famillyUserFriends length : " + famillyUserFriends.length);
      },
      getFamilyUserFriends: function () {
        return famillyUserFriends;
      },
      setBirthdayUFList: function (ufList) {
        birthdayUserFriends = ufList;
        console.log("birthDayUserFriends length : " + birthdayUserFriends.length);
      },
      getBirthdayUserFriends: function () {
        return birthdayUserFriends;
      },

    };

    return service;

  }]);
