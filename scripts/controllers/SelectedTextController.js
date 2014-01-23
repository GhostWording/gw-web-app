// Displays a text and allows to send it
cherryApp.controller('SelectedTextController', ['$scope', '$filter','SelectedText','SelectedIntention','HelperService', 'PostActionSvc',function ($scope, $filter,SelectedText,SelectedIntention,HelperService, PostActionSvc) {

    $scope.PostBox = PostActionSvc;


    $scope.initializeModal = function () {
    console.log('initializeModal');
    $scope.Modal.modalIsOpened = true;
  };

  $scope.fermer = function () {
    $scope.Modal.modalIsOpened = false;
        $scope.PostBox.gulp('Command','Close' ,'SendText');
  };

  // Because this controller may initialize just once, I watch SelectedText.getSelectedTextLabel() to update scope variable
  // There may be a better solution
  $scope.callMeForCurrentTxt = SelectedText.getSelectedTextLabel;
  var writeChange = function (){
    $scope.textToSend  = SelectedText.getSelectedTextLabel(); // may look in the cache or call the server
    //console.log('textToSend ' +$scope.textToSend);
  };
  $scope.$watch('callMeForCurrentTxt()',writeChange,true);


  // TODO : not good, we want the edited text, not the original one
  $scope.urlMailTo = function () {
    return HelperService.urlMailTo($scope.textToSend, SelectedIntention.getSelectedIntentionLabel());
  };

  $scope.sms = function () {
    window.open(HelperService.urlSMSTo($scope.textToSend), '_blank');
        var textId = SelectedText.getTextId();

        $scope.PostBox.gulp('Command',textId ,'SendText','sendSMS');
    };

  $scope.texteCourantCanTweet = HelperService.canTweet ($scope.textToSend);
  $scope.tweet = function () {
    window.open(HelperService.urlTweetTo($scope.textToSend), '_blank');

        var textId = SelectedText.getTextId();

        $scope.PostBox.gulp('Command',textId ,'SendText','sendTweet');
  };

   $scope.mail = function () {
       var textId = SelectedText.getTextId();
       $scope.PostBox.gulp('Command',textId ,'SendText','sendMail');
   };

    $scope.copy = function () {
        var textId = SelectedText.getTextId();
        $scope.PostBox.gulp('Command',textId ,'SendText','sendCopy');
    };

  $scope.isIPhone = function () {
    var retval = false;
    if (navigator.userAgent.indexOf('iPhone') != -1)
      retval = true;
    return retval;
  };

  // Not used
  $scope.ajouterFormuleAvant = function (formule) {
    var newTxt  = formule +',\n\n'+ $scope.textToSend;
    SelectedText.setSelectedTextLabel(newTxt);
  };

  $scope.ajouterFormuleApres = function (formule) {
//    var txt = $scope.textToSend;
//    /* var appliAvaitSignature =false;
//     if ( txt.indexOf($scope.signatureAppli) > 0)
//     {
//     txt =  txt.replace("\n\n"+$scope.signatureAppli, "");
//     appliAvaitSignature = true;
//     }*/
//    txt = txt + '\n' + formule;
//    /*if ( appliAvaitSignature )
//     txt = $scope.ajouterSignatureAppli(txt);*/
//
//    $scope.textToSend = txt;
  };


}]);

// OLD CODE

//  $scope.urlMailTo = function () {
//    var t = SendText.addSignatureAppli(SendText.getSelectedTextLabel());
//    var rootUrl = "mailto:?subject=" + $scope.TextPanel.intentionCourante + "&body=" + t;
//    rootUrl = SendText.replaceEndOfLines(rootUrl);
//    return rootUrl;
//  };


//  $scope.texteCourantCanTweet = function () {
//    return $scope.libelleTexteCourant.length < 141;
//  };

//
//  $scope.signatureAppli = "Ecrit avec CommentVousDire.com";
//  $scope.ajouterSignatureAppli = function (libelleTexte) {
//    return libelleTexte + "\n\n" + $scope.signatureAppli;
//  };

//  $scope.tweet = SendText.tweet($scope.libelleTexteCourant);
//$scope.tweet = SendText.tweet($scope.currentText.txt);

//  $scope.sms = function () {
//    var txt = $scope.ajouterSignatureAppli($scope.libelleTexteCourant);
//    var rootUrl = "sms:?body=" + txt;
//    rootUrl = replaceEndOfLines(rootUrl);
//    window.open(rootUrl, '_blank');
//  };

//  $scope.sms = SendText.sms($scope.libelleTexteCourant);
//  $scope.sms = SendText.sms($scope.currentText.txt);


//  var replaceEndOfLines = function (input) {
//    return input.replace(/[\r\n]/g, "%0A");
//  };

//  $scope.mailto = function () {
//    window.open($scope.urlMailTo(), '_blank');
//  };

//  Browsers will not open a new window for us
//  $scope.mailto = SendText.mailTo(SendText.getSelectedTextLabel(),$scope.TextPanel.intentionCourante);

//  $scope.urlMailTo = SendText.urlMailTo($scope.libelleTexteCourant,$scope.TextPanel.intentionCourante);
//  $scope.urlMailTo = SendText.urlMailTo(SendText.getSelectedTextLabel(),$scope.TextPanel.intentionCourante);

//  $scope.urlAppli = "http://www.commentvousdire.com";
//
//
//  $scope.urlMailTo = function () {
//    var txt = $scope.ajouterSignatureAppli($scope.libelleTexteCourant);
//    var rootUrl = "mailto:?subject=" + $scope.TextPanel.intentionCourante +
//      "&body=" + txt;
//    rootUrl = replaceEndOfLines(rootUrl);
//    return rootUrl;
//  };
