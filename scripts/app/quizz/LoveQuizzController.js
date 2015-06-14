angular.module('app/quizz/LoveQuizzController',['common/texts/textsSvc'])

.controller('LoveQuizzController', ['$scope', '$rootScope', 'currentUserLocalData','textsSvc','appUrlSvc','postActionSvc','currentLanguage',
  function ($scope,$rootScope, currentUserLocalData,textsSvc,appUrlSvc,postActionSvc,currentLanguage) {

    // Set facebook image
    $rootScope.ogImage = "http://gw-static.azurewebsites.net/specialoccasions/I-love-you/default/small/shutterstock_237303379.jpg";

    // TODO : set group id for Spanish, create a function in common that returns a quizz text group for an intention and culture
    var Quizz_Text_Group_MAP = {
      'fr-FR' : 'E5F46A',
      'en-EN' : 'FDF797',
      'es-ES' : '1BE9B9'
    };

    function rankAndSetAsSelected(sortedTexts, preferredTextId) {
      // Rank and set as selected
      sortedTexts.forEach(function(obj) {
        // Calculate rank property : this should be a property read from the server
        obj.rank = sortedTexts.indexOf(obj)+1;
        // Set selected text
        if (preferredTextId && preferredTextId == obj.TextId)
          $scope.setSelectedText(obj);
      });
      //    var ranks = texts.slice().map(function(v){ return sorted.indexOf(v)+1 });
      //      rankMap= sorted.map(function(obj){
      //        var rObj = {};
      //        rObj[obj.TextId] = sorted.indexOf(obj)+1;
      //        obj.rank = sorted.indexOf(obj)+1;
      //        return rObj;
      //      });
    }

    function getTextListGroupForCulture(groupCulture) {
      var groupID = Quizz_Text_Group_MAP[groupCulture];
      textsSvc.getTextListForGroup('General', groupID, groupCulture, false, false).then(function(texts) {
        $scope.quizzQuestionTexts = texts;
        // Sort text according to SortBy
        var sorted = texts.slice().sort(function(a,b){return -(b.SortBy- a.SortBy);});
        // Mark one text as selected if applicable, and calculate ranking
        rankAndSetAsSelected(sorted,currentUserLocalData.loveQuizzTextId);
      });
    }

    getTextListGroupForCulture(currentLanguage.getCultureCode());

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

    $scope.getTextRanking = function(txt) {
      return !! selectedTextId ?  txt.rank : '?';
    };

    $scope.getImageName = function(txt) {
      var retval = '';
      if ( !!txt && txt.ImageUrl)
        retval = appUrlSvc.getFileName(txt.ImageUrl);
      return retval;
    };

    // When users move to another page, confirm choice
    $scope.confirmQuizzChoice = function() {
      if ( !!selectedText )
        postActionSvc.postActionInfo('QuizzConfirm',selectedText.TextId,'LoveQuizz','click',$scope.getImageName(selectedText));
    };

  }]);
