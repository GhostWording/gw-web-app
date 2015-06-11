angular.module('app/quizz/LoveQuizzController',['common/texts/textsSvc'])

.controller('LoveQuizzController', ['$scope', '$rootScope', 'currentUserLocalData','textsSvc','appUrlSvc','postActionSvc','areasSvc',
  function ($scope,$rootScope, currentUserLocalData,textsSvc,appUrlSvc,postActionSvc,areasSvc) {

    areasSvc.setCurrentName('cvdWeb');

    $rootScope.pageTitle1 = "La meilleure façon de me dire...";
    $rootScope.pageTitle = "La meilleure façon de me dire...";
    $rootScope.pageDescription = "Je t'aime";
    $rootScope.ogDescription = "Je t'aime";

    $rootScope.ogImage = "http://gw-static.azurewebsites.net/specialoccasions/I-love-you/default/small/shutterstock_237303379.jpg";


    textsSvc.getTextListForGroup('General', 'E5F46A', 'fr-FR', false, false).then(function(texts) {
      $scope.quizzQuestionTexts = texts;
      // Sort text according to SortBy
      var sorted = texts.slice().sort(function(a,b){return -(b.SortBy- a.SortBy);});
      sorted.forEach(function(obj) {
        // Calculate rank property
        obj.rank = sorted.indexOf(obj)+1;
        // Set selected text
        if (currentUserLocalData.loveQuizzTextId && currentUserLocalData.loveQuizzTextId == obj.TextId)
          $scope.setSelectedText(obj);
      });

//    var ranks = texts.slice().map(function(v){ return sorted.indexOf(v)+1 });
//      rankMap= sorted.map(function(obj){
//        var rObj = {};
//        rObj[obj.TextId] = sorted.indexOf(obj)+1;
//        obj.rank = sorted.indexOf(obj)+1;
//        return rObj;
//      });
    });

    var selectedTextId;
    var selectedText;

    $scope.showRanking = false;

    $scope.setShowRanking = function() {
      $scope.showRanking = true;
      console.log("$scope.showRanking = true;");
    };

    $scope.choiceSelected = function() {
      var valret =  selectedText !== undefined;
      return valret;
    };

    $scope.getSelectedTextId = function() {
      return selectedTextId;
    };

    $scope.setSelectedText = function(txt) {
      selectedTextId = txt.TextId;
      selectedText = txt;
      currentUserLocalData.loveQuizzTextId = selectedTextId;
    };

    // TODO : get this from server
    $scope.getTextRanking = function(txt) {
      return !! selectedTextId ?  txt.rank : '?';
    };

    $scope.getImageName = function(txt) {
      var retval = '';
      if ( !!txt && txt.ImageUrl)
        retval = appUrlSvc.getFileName(txt.ImageUrl);
      return retval;
    };

    $scope.confirmQuizzChoice = function() {
      if ( !!selectedText )
        postActionSvc.postActionInfo('QuizzConfirm',selectedText.TextId,'LoveQuizz','click',$scope.getImageName(selectedText));
    };


  }]);
