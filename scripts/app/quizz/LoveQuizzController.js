angular.module('app/quizz/LoveQuizzController',['common/texts/textsSvc'])

.controller('LoveQuizzController', ['$scope',  'serverSvc','currentUserLocalData','textsSvc','appUrlSvc','postActionSvc','areasSvc',
  function ($scope, serverSvc,currentUserLocalData,textsSvc,appUrlSvc,postActionSvc,areasSvc) {

    areasSvc.setCurrentName('cvdWeb');

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
          //console.log(currentUserLocalData.loveQuizzTextId);
      });

//      if (currentUserLocalData.loveQuizzTextId)
//        console.log(currentUserLocalData.loveQuizzTextId);
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
