angular.module('app/userFriend/ufSvc', ['common/services/helperSvc'])

.factory('ufSvc', ['helperSvc',
  function (helperSvc) {
    var allUserFriends = [];
    var famillyUserFriends = [];
    var birthdayUserFriends = [];

    var service = {
      setUserFriends: function (ufList) {
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
      setBirthdayUserFriends: function (ufList) {
        birthdayUserFriends = ufList;
        console.log("birthDayUserFriends length : " + birthdayUserFriends.length);
      },
      getBirthdayUserFriends: function () {
        return birthdayUserFriends;
      },

    };

    return service;

  }]);
