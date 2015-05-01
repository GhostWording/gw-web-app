angular.module('app/appUrl/appUrlSvc', ['common/i18n/availableLanguages','common/i18n/slugTranslations'])

// This is mostly used by the web app to create urls and track entry points
.factory('appUrlSvc', ['$location','currentLanguage','availableLanguages','slugTranslations', function ($location,currentLanguage,availableLanguages,slugTranslations) {
  var fullrootPath = "/";
  var siterootPath = "/"; // or just "", to be tested
  var useHashBang = false;
  var useLanguageCodes= true;

  var service = {};

  var domains  = ['commentvousdire.com','touchwording.com','localhost'];

  var pivotName = 'PIVOT';

  service.findLanguageInPath = function () {
    var languageFound;
    var languages = availableLanguages.orderedAppLanguages();
    for (var i = 0; i < languages.length; i++) {
      var pos = $location.path().indexOf('/' + languages[i] + '/');
      if (pos > -1 && pos < 2) {
        languageFound = languages[i];
        break;
      }
    }
    return languageFound;
  };


  service.makePivotUrl = function () {
    var urlPivot = $location.absUrl();

    //var path = $location.path();

    var pathNoLanguage = $location.path();
    //var retval = urlToReduce;
    var possibleLanguages = availableLanguages.orderedAppLanguages();
    for (var i = 0; i < possibleLanguages.length; i++) {
      pathNoLanguage = pathNoLanguage.replace('/' + possibleLanguages[i] + '/', '/');
    }
    console.log("path-language : " + pathNoLanguage);
    urlPivot = urlPivot.replace($location.path(), pathNoLanguage);
    console.log("urlToReduce : " + urlPivot);

    var strHost = $location.host();
    console.log("host : " + strHost);
    urlPivot = urlPivot.replace(strHost, pivotName);
    console.log("urlToReduce : " + urlPivot);

    return urlPivot;
  };

  // Replace domain in url according language in path
  service.makeCanonicalUrl = function() {
    var canonicalUrl = $location.absUrl();
    var languageInPath = service.findLanguageInPath();
    console.log("languageInPath : " + languageInPath);
    var strHost = $location.host();
    // If we explicitly have a language in the path, choose canonical domain name accordingly
    if ( !!languageInPath ) {
      if ( languageInPath == 'fr' )
        canonicalUrl = canonicalUrl.replace(strHost,"www.commentvousdire.com");
      else
        canonicalUrl = canonicalUrl.replace(strHost,"www.touchwording.com");
    }
    console.log("canonicalUrl : " + canonicalUrl);
    return canonicalUrl;
  };

  // Remove language from url and replace commentvousdire by touchwording to have language neutral url
  service.makeLanguageNeutralUrl = function() {
     var pivotUrl = service.makePivotUrl();
     pivotUrl = pivotUrl.replace(pivotName,"www.touchwording.com");


    var strBeforeSlug = "intention/";
    var strAfterSlug = "/text";
    var posBefore = pivotUrl.lastIndexOf(strBeforeSlug);
    var posAfter = pivotUrl.lastIndexOf(strAfterSlug);
    var slug;
    if ( posBefore >= 0 && posAfter >= 0) {
      console.log("SLUG  ===> " + slug);
      slug = pivotUrl.substring(posBefore+strBeforeSlug.length,posAfter);
      var englishSlug = slugTranslations.translateSlugToEnglish(slug);
      console.log("englishSlug  ===> " + englishSlug);
      pivotUrl = pivotUrl.replace(slug,englishSlug);
    }
    console.log($location.absUrl() + " ===> " + pivotUrl);
    return pivotUrl;
  };

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