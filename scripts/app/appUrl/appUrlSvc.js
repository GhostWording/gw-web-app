angular.module('app/appUrl/appUrlSvc', ['common/i18n/availableLanguages','common/i18n/slugTranslations'])

// This is mostly used by the web app to create urls and track entry points
.factory('appUrlSvc', ['$location','currentLanguage','availableLanguages','slugTranslations',
function ($location,currentLanguage,availableLanguages,slugTranslations) {
  var fullrootPath = "/";
  var siterootPath = "/"; // or just "", to be tested
  var useHashBang = false;
  var useLanguageCodes= true;

  var service = {};

  //var domains  = ['commentvousdire.com','touchwording.com','localhost'];


  service.setQueryParameters = function(imageUrl) {
    // Extract image name from url
    var imageName= service.getPathFromUrl(imageUrl);
    // Separate image file extension from image name
    var dotIndex = imageName.lastIndexOf('.');
    // Set url query parameters for image name and image file extension
    var urlNoExtension = imageName.substring(0,dotIndex);
    $location.search('imagePath',urlNoExtension);
    var extNoDot = imageName.substring(dotIndex+1);
    $location.search('imageExtension',extNoDot);
  };

  service.makeStaticFbSendWebAppUrlFromCurrentUrl = function() {
    var pageUrl = $location.absUrl();
    var hostwithport = $location.$$port ? $location.$$host+":"+$location.$$port : $location.$$host;
    var urlToLinkTo = pageUrl.replace(hostwithport,"www.commentvousdire.com/webapp");
    urlToLinkTo = urlToLinkTo.replace("imagePath=","imagePath=/");
    return urlToLinkTo;
  };






  service.isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (service.isMobile.Android() || service.isMobile.BlackBerry() || service.isMobile.iOS() || service.isMobile.Opera() || service.isMobile.Windows());
    }
  };

  console.log ("Is MOBILE : " + service.isMobile.any());

  service.removeTrailingSlash = function (thePath) {
    var retval = thePath;
    if (!! thePath  ) {
      retval = retval.replace(/\/$/, "");
    }
    return retval;
  };

  service.getFileName = function(path) {
    if ( !path )
      return '';
    var m = path.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(:([^\/]*))?((\/[\w/-]+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?$/i);
    if (m && m.length >= 9)
      return m[8];
    else
      return '';
    // The file name is the 8th bit of this pattern
    //return path.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(:([^\/]*))?((\/[\w/-]+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?$/i)[8];
  };

  service.getPathFromUrl = function(anUrl) {
    // Check that there is a vage possibility it could be an url
    if ( anUrl.lastIndexOf('/') < 0)
      return anUrl;

    var a = document.createElement('a');
    a.href = anUrl;
    return a.pathname;
  //      ['href','protocol','host','hostname','port','pathname','search','hash'].forEach(function(k) {
  //        console.log(k+':', a[k]);
  //      });
  };

  service.findLanguageInPath = function () {
    var languageFound;
    var languages = availableLanguages.orderedAppLanguages();
    for (var i = 0; i < languages.length; i++) {
      // /xx/ or /xx
      var AA = $location.path().match(new RegExp('\/' + languages[i] + '($|/)')) ;
      //console.log("AA : " + AA + " FOR " + $location.path() + " AND " + languages[i]);
      //var pos = $location.path().indexOf('/' + languages[i] + '/');
      //if (pos > -1 && pos < 2) {
      if ( AA ) {
        languageFound = languages[i];
        break;
      }
    }
    return languageFound;
  };

  // Remove language from path if present
  service.getPathWithNoLanguage = function (thePath) {
    var pathNoLanguage = thePath;
    var possibleLanguages = availableLanguages.orderedAppLanguages();
    //console.log("BEFORE : " + pathNoLanguage);
    for (var i = 0; i < possibleLanguages.length; i++) {
      // Replace by / if /xx/ in middle of string
      pathNoLanguage = pathNoLanguage.replace('/' + possibleLanguages[i] + '/', '/');
      // Replace by nothing if /xx at end of string
      pathNoLanguage = pathNoLanguage.replace(new RegExp('\/' + possibleLanguages[i] + '$'), '');
    }
    //console.log("AFTER : " + pathNoLanguage);
    return pathNoLanguage;
  };

  // Change host name in url according to language
  service.changeUrlToTargetLanguageDomain = function(sourceUrl, theHost, theLanguage) {
    var canonicalUrl = sourceUrl;
//    if ( !!theLanguage ) {
//      if ( theLanguage == 'fr' )
//        canonicalUrl = canonicalUrl.replace(theHost,"www.commentvousdire.com");
//      else
//        canonicalUrl = canonicalUrl.replace(theHost,"www.touchwording.com");
//    }
    //console.log("canonicalUrl : " + canonicalUrl);
    return canonicalUrl;
  };

  // Replace domain in url according language in path
  service.makeCanonicalUrl = function() {
    var canonicalUrl = service.changeUrlToTargetLanguageDomain($location.absUrl(),$location.host(),service.findLanguageInPath());
    //console.log("canonicalUrl : " + canonicalUrl);
    return canonicalUrl;
  };


  service.makeAltUrlForLanguage = function(targetLanguage) {
    // If there is a language code in path and it is the targetLanguage we are ok, still we may want to point to the official domain for the language
//    var languageInPath = service.findLanguageInPath();
//    if ( languageInPath == targetLanguage )
//      return $location.absUrl();

    // Make url with proper domain for current language
    var altUrl  = service.changeUrlToTargetLanguageDomain($location.absUrl(),$location.host(),targetLanguage);

    var currentPath = $location.path();

    if ( currentPath == '/')
      altUrl = altUrl + targetLanguage;
    else {
      var pathWithNoLanguage =  service.getPathWithNoLanguage(currentPath);
      var pathWithTargetLanguage = '/' + targetLanguage + pathWithNoLanguage;
      //console.log("------------- " + pathWithTargetLanguage);
      altUrl = altUrl.replace(currentPath,pathWithTargetLanguage);
    }

    // We should be able to do that for all languages but we first to download proper lookup tables from the server
    if ( targetLanguage == 'en' )
      altUrl = service.changeSlugToEnglish(altUrl);
    return altUrl;

  };

  service.changeSlugToEnglish = function(urlToChange) {
    var retval = urlToChange;
    // Change slug to english
    var strBeforeSlug = "intention/";
    var strAfterSlug = "/text";
    var posBefore = urlToChange.lastIndexOf(strBeforeSlug);
    var posAfter = urlToChange.lastIndexOf(strAfterSlug);
    var slug;
    if ( posBefore >= 0 && posAfter >= 0) {
      //console.log("SLUG  ===> " + slug);
      slug = urlToChange.substring(posBefore+strBeforeSlug.length,posAfter);
      var englishSlug = slugTranslations.translateSlugToEnglish(slug);
      //console.log("englishSlug  ===> " + englishSlug);
      retval = urlToChange.replace(slug,englishSlug);
    }
    return retval;
  };

  service.makeLanguageNeutralUrl = function() {
    var languageNeutralUrl = $location.absUrl();
    var originalPath = $location.path();
    var pathNoLanguage = service.getPathWithNoLanguage(originalPath);

    // Remove language from path
    languageNeutralUrl = languageNeutralUrl.replace(originalPath,  pathNoLanguage);
    // Change host to touchwording
    //languageNeutralUrl = languageNeutralUrl.replace($location.host(),"www.touchwording.com");
    languageNeutralUrl = service.changeSlugToEnglish(languageNeutralUrl);
    //console.log($location.absUrl() + " ===> " + languageNeutralUrl);
    return languageNeutralUrl;
  };



    // text detail page may be the first page the user sees if he comes form another web site
  var textDetailWasCalledFromTextList = false;
  var textDetailWasCalledFromDashboard = false;
  var userHasBeenOnSplashScreen = false;

  service.setTextDetailWasCalledFromTextList = function(value) {
    textDetailWasCalledFromTextList = value;
    //console.log("setTextDetailWasCalledFromTextList to " + value);
  };
  service.getTextDetailWasCalledFromTextList = function() {
    return textDetailWasCalledFromTextList;
  };
  service.setTextDetailWasCalledFromDashboard = function(value) {
    textDetailWasCalledFromDashboard = value;
    //console.log("textDetailWasCalledFromTextList to " + value);
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
    var retval = service.getRootPath() + url;
    // We don't want a trailing slash if we only have a
    if (!url)
      retval = service.removeTrailingSlash(retval);
    //console.log(retval)
    return retval;
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