angular.module('app/appUrl/appUrlSvc', [])

// This is mostly used by the web app to create urls and track entry points
.factory('appUrlSvc', ['$location','currentLanguage', function ($location,currentLanguage) {
  var fullrootPath = "/";
  var siterootPath = "/"; // or just "", to be tested
  var useHashBang = false;
  var useLanguageCodes= true;

  var service = {};

  // text detail page may be the first page the user sees if he comes form another web site
  var textDetailWasCalledFromTextList = false;
  var textDetailWasCalledFromDashboard = false;
  var userHasBeenOnSplashScreen = false;

  service.setTextDetailWasCalledFromTextList = function(value) {
    textDetailWasCalledFromTextList = value;
    console.log("setTextDetailWasCalledFromTextList to " + value);
  };
  service.getTextDetailWasCalledFromTextList = function() {
    return textDetailWasCalledFromTextList;
  };
  service.setTextDetailWasCalledFromDashboard = function(value) {
    textDetailWasCalledFromDashboard = value;
    console.log("textDetailWasCalledFromTextList to " + value);
  };
  service.getTextDetailWasCalledFromDashboard = function() {
    return textDetailWasCalledFromDashboard;
  };

  service.getUserHasBeenOnSplashScreen = function() {
    return userHasBeenOnSplashScreen;
  };
  service.setUserHasBeenOnSplashScreen = function(value) {
    userHasBeenOnSplashScreen = value;
  };

  // Calling this all the time does seem to slow the app a little
  service.getRootPath = function () {
//    var retval = location.hostname == 'localhost' ? siterootPath : fullrootPath;
    var retval = useHashBang ? '#!/' : "/";
    if ( useLanguageCodes  ) {
      var code = currentLanguage.getLanguageCode();
      if (code )
        retval += code+'/';
    }
    return retval;
  };
  service.getFullPath = function (url) {
    return service.getRootPath() + url;
  };

  service.isDashboardPath = function() {
    var path = $location.path();
    return path.indexOf("dashboard") > -1;
  };

  // Which slug should we use as an id for an intention ?
  service.getIntentionSlug = function(intention) {
    if ( !intention )
      console.log("getIntentionSlug called for null intention");
    // Default value will be intention slug if no local version available
    var retval =  intention.SlugPrototypeLink; // TODO : get slug for current language
    var culture = currentLanguage.currentCulture();

    for (var i = 0 ; i < intention.Labels.length; i++) {
      var lab = intention.Labels[i];
      if ( lab.Culture == culture ) {
        retval = lab.Slug;
        break;
      }
    }
    return retval;
  };

  return service;
}

]);