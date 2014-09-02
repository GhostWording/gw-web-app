// Displays a text and allows to send it
cherryApp.controller('SelectedTextController', ['$scope', '$filter','SelectedText','SelectedIntention','HelperService', 'postActionSvc',
function ($scope, $filter,SelectedText,SelectedIntention,HelperService, postActionSvc) {

    $scope.getSelectedTextId = SelectedText.getTextId;

    $scope.initializeModal = function () {
        console.log('initializeModal');
        //$scope.Modal.modalIsOpened = true;
    };
    $scope.fermer = function () {
        //$scope.Modal.modalIsOpened = false;
    };

    // Because this controller may initialize just once, we watch SelectedText.getSelectedTextLabel() to update scope variable
    // There may be a better solution
    $scope.callMeForCurrentTxt = SelectedText.getSelectedTextLabel;
    var writeChange = function () {
        $scope.textToSend = SelectedText.getSelectedTextLabel(); // may look in the cache or call the server
    };
    $scope.$watch('callMeForCurrentTxt()', writeChange, true);

    // TODO : not good, we want the edited text, not the original one
    $scope.urlMailTo = function () {
        return HelperService.urlMailTo($scope.textToSend, SelectedIntention.getSelectedIntentionLabel());
    };

    $scope.sms = function () {
        window.open(HelperService.urlSMSTo($scope.textToSend), '_blank');
    };

    $scope.texteCourantCanTweet = HelperService.canTweet($scope.textToSend);
    $scope.tweet = function () {
        window.open(HelperService.urlTweetTo($scope.textToSend), '_blank');
        var textId = SelectedText.getTextId();
    };

    $scope.mail = function () {
        var id = SelectedText.getTextId();
        // Hack : Event will be posted twice to go around vanishing http request bug
        postActionSvc.postActionInfo('Text',id, 'SendTextModal','sendMailBis');
    };

    $scope.copy = function () {
    };

    $scope.isIPhone = function () {
    var retval = false;
    if (navigator.userAgent.indexOf('iPhone') != -1)
      retval = true;
    return retval;
  };

  // Not used yet
  $scope.ajouterFormuleAvant = function (formule) {
    var newTxt  = formule +',\n\n'+ $scope.textToSend;
    SelectedText.setSelectedTextLabel(newTxt);
  };

}]);

// CODE to add sender signature to message, will be used in the future

//$scope.ajouterFormuleApres = function (formule) {
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
//  };

//  $scope.signatureAppli = "Ecrit avec CommentVousDire.com";
//  $scope.ajouterSignatureAppli = function (libelleTexte) {
//    return libelleTexte + "\n\n" + $scope.signatureAppli;
//  };
//  $scope.mailto = function () {
//    window.open($scope.urlMailTo(), '_blank');
//  };
//  Browsers will not open a new window for us
//  $scope.mailto = SendText.mailTo(SendText.getSelectedTextLabel(),$scope.TextPanel.intentionLabel);
