// Send user action info to the server
cherryApp.factory('PostActionSvc', ['$http','AppUrlSvc','SelectedArea', function ($http, AppUrlSvc,SelectedArea) {

    // TODO : inject a service to provide AreaId and DeviceType
    var o = {};

//    ActionType : "default" for the time being
//    targetType : Area / Intention / Text / Navigation / Command (such as filter, profile or language buttons)
//    eventTarget   : for areas, intentions and texts : their id,
//                     for navigation : a chosen name for the target (GeneralArea, ImportantArea,  RecipientList)
//                     for commands : the id of the property they are targeting (like Gender - Male, Age - over45,...)
//    actionLocation : where the object is located : MenuBar, SplashScreen, TextDetailView, TextList, IntentionList,.....
//    + AreaId, UserId, UserAgent

    o.postActionInfo = function (targetType, targetId, actionLocation, actionType,targetParameter) { // + targetParameter
        if ( actionType === undefined ) actionType = 'click';
        if ( actionLocation === undefined ) actionLocation = '';
        if ( targetParameter === undefined ) targetParameter = '';

        var area = SelectedArea.getSelectedAreaName();
        if ( area === undefined )
            area = '';

        switch (targetType) {
            case 'Area':
            case 'area':
            case 'Intention':
            case 'intention':
            case 'Text':
            case 'Navigation':
            case 'Command':
            case 'Init':
            case 'userprofile':
                break;
            default:
                console.log("!!!! objectType " + targetType + " unknown !!!!!!!!!!!");
                break;
        }
    // Todo : inject areaId, appId and device type
//        console.log("actionType,objectType, objectLocation => objectTarget " + actionType + " , " + objectType + " : " +   objectLocation  + " => "  + objectTarget  );
        console.log("--- " + targetType + " : " +   actionLocation  + " => "  + targetId + "  :  " + actionType + ' for ' + area);

        // + client datetime + target parameter

        var url = AppUrlSvc.urlUserEvent();

        $http({method: 'GET',cache:false,url: url,
            params:{ActionType :actionType,ActionLocation:actionLocation, TargetType: targetType, TargetId: targetId, TargetParameter: targetParameter, AreaId: area, ClientTime: '' },
//            headers: {"Content-Type":"application/json","Accept-Language":"fr-FR"}
            headers: {"Content-Type":"application/json"}
        })
            .success(function (data, status) {
                console.log(status + "*");
            })
            .error(function (data, status) {
                console.log("-- bad request -- status " + status + " for "  + url);
            });
    };

    // Old
//    o.postActionForText = function(intentionId,textId,action) {
     o.postActionInfo.postActionForText = function(intentionId,textId,action) {
        var urlPostViewAction = AppUrlSvc.getApiIntentionAndTextRoot(intentionId,textId) + action;
        $http.post(urlPostViewAction)
            .success(function (data, status) {
                console.log(urlPostViewAction + " " + status + "*");
            })
            .error(function (data, status) {
                console.log(urlPostViewAction + " " + status + "*");
            });
    };


    return o;
}]);