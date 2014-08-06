angular.module('app/users/currentUserLocalData', [
  'common/services/deviceIdSvc'
])

.factory('currentUserLocalData',['$rootScope','localStorage','deviceIdSvc','serverSvc',function($rootScope,localStorage,deviceIdSvc,serverSvc) {

  var key = 'currentUserLocalData' + '.' + deviceIdSvc.get();

  // On initialisation, read from storage
  var currentUser = localStorage.get(key) || {
    email: null,
    fbId : null,
    fbMe : null,
    subcriptions: null,
    fbFriends: null,
    fbFamily: null
  };


  currentUser.setPropertiesFromFbMe = function (me) {
    this.fbMe = me;
    if ( !this.email )
      this.email = me.email;
  };

  currentUser.setFbId = function(id) {
//    var loguedUserId = 'facebook' + ':' + id;
//    var loguedUserId = '['+ 'facebook' + ':' + id + ']';
    var loguedUserId = 'facebook' + '-' + id;
    if ( currentUser.fbId === null ) {
      // TODO : query server to try and synchronize data
      serverSvc.postInStore('userDeviceStore',loguedUserId, deviceIdSvc.get()) ;
      //serverSvc.postInStore(loguedUserId,'userDeviceStore', deviceIdSvc.get()) ;

      // Memorize id
      currentUser.fbId = loguedUserId;
    } else {
      serverSvc.postInStore('userDeviceStore',loguedUserId, deviceIdSvc.get()) ;
      //serverSvc.postInStore(loguedUserId,'userDeviceStore', deviceIdSvc.get()) ;
      // Another user is using the device, we should clear all local data
      if (loguedUserId != currentUser.fbId ) {
        console.log("loguedUserId != currentUser.fbId");
        // TODO delete all local storage
        localStorage.clearAllExceptThis(deviceIdSvc.get());
        // TODO : copy data from server to local storage
      }
    }
  };

  currentUser.nbFriends = function() {
    return !!currentUser.fbFriends ?  currentUser.fbFriends.length : 0;
  };
  currentUser.nbFamily = function() {
    return !!currentUser.fbFamily ?  currentUser.fbFamily.length : 0;
  };

  // Whenever a property changes, write everything to local storage
  $rootScope.$watch(function() { return currentUser; }, function(value, oldValue) {
    if ( value !== oldValue ) {
      localStorage.set(key, currentUser);
    }
  }, true);
  // If subscriptions change, inform server
  $rootScope.$watch(function() { return currentUser.subcriptions; }, function(value, oldValue) {
    if ( value !== oldValue ) {
      console.log("sendingSuscriptionsToServer");
      serverSvc.postInStore('subscriptionStore', deviceIdSvc.get(), currentUser.subcriptions);
    }
  }, true);

  // Subscription can be changed by an independent module, so watch for that
  $rootScope.$on('users.subcriptionChange',function (ev,subscription) {
    currentUser.subcriptions = subscription;
  });

  return currentUser;
}])


;