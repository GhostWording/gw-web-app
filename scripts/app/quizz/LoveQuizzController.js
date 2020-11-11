angular.module('app/quizz/LoveQuizzController',['common/texts/textsSvc'])

.controller('LoveQuizzController', ['$scope', '$rootScope', 'currentUserLocalData','textsSvc','appUrlSvc','postActionSvc','currentLanguage','serverSvc',
  function ($scope,$rootScope, currentUserLocalData,textsSvc,appUrlSvc,postActionSvc,currentLanguage,serverSvc) {

    postActionSvc.postActionInfo('Init','Page','LoveQuizz','Init');

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

//    function getTextPrototypeIds() {
//      //var retval = [{'PrototypeId' : "01C699"}, {'PrototypeId' : "53F203"}, {'PrototypeId': "94A261"}, {'PrototypeId': "B00253"},{'PrototypeId': "E44511"} ,{'PrototypeId': "F440F4"}];
//      //var retval = ["01C699","53F203","94A261", "B00253","E44511","F440F4"];
//      var retval = {"PrototypeIds" : "01C699,53F203,94A261,B00253,E44511,F440F4"};
//      serverSvc.getConfigResource('data/quizz/LoveQuizz.json').then(function(res) {
//        console.log(res);
//      });
//      return retval;
//    }

    function getTextListGroupForCulture(groupCulture) {
      // Read the config file
      serverSvc.getConfigResource('data/quizz/LoveQuizz.json')
        .then(function(configFile) {
          // Get the (comma separated) text prototype ids from the config file
          var ids = configFile.PrototypeIds;
          // Ask server for the texts corresponding to the prototype ids and the current culture
          return textsSvc.getTextListFromPrototypeIds('General',ids,groupCulture);
      },function(error) {console.log(error);})
        .then(function(texts) {
          // Display the texts
          $scope.quizzQuestionTexts = texts;
          // Sort text according to SortBy : not used
          var sorted = texts.slice().sort(function(a,b){return -(b.SortBy- a.SortBy);});
          // Mark one text as selected if applicable, and calculate ranking : not used
          rankAndSetAsSelected(sorted,currentUserLocalData.loveQuizzTextId);
        });
    }


//    function getTextListGroupForCulture(groupCulture) {
//      var groupID = Quizz_Text_Group_MAP[groupCulture];
//      textsSvc.getTextListForGroup('General', groupID, groupCulture, false, false).then(function(texts) {
//        $scope.quizzQuestionTexts = texts;
//        // Sort text according to SortBy
//        var sorted = texts.slice().sort(function(a,b){return -(b.SortBy- a.SortBy);});
//        // Mark one text as selected if applicable, and calculate ranking
//        rankAndSetAsSelected(sorted,currentUserLocalData.loveQuizzTextId);
//      });
//    }

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
