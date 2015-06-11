angular.module('app/quizz/QuizzController',['app/recipients'])

.controller('QuizzController', ['$scope', 'subscribedRecipientTypesSvc', 'subscriptionsSvc','serverSvc','currentUserLocalData','deviceIdSvc','recipientTypeHelperSvc','currentUser','textsSvc',
  function ($scope, subscribedRecipientTypesSvc, subscriptionsSvc,serverSvc,currentUserLocalData,deviceIdSvc,recipientTypeHelperSvc,currentUser,textsSvc) {

    textsSvc.getTextListForGroup('General', 'E5F46A', 'fr-FR', false, false).then(function(texts) {
      $scope.quizzQuestionTexts = texts;
      console.log(texts.length);
      // Make ordered
      //var sorted = texts.slice().sort(function(a,b){return b.Author.length- a.Author.length;});
      var sorted = texts.slice().sort(function(a,b){return -(b.SortBy- a.SortBy);});
//      var ranks = texts.slice().map(function(v){ return sorted.indexOf(v)+1 });
      sorted.forEach(function(obj) {
        obj.rank = sorted.indexOf(obj)+1;
      });
//      rankMap= sorted.map(function(obj){
//        var rObj = {};
//        rObj[obj.TextId] = sorted.indexOf(obj)+1;
//        obj.rank = sorted.indexOf(obj)+1;
//        return rObj;
//      });
      //console.log(rankMap);

    });

    var selectedTextId;


    $scope.getSelectedTextId = function() {
      return selectedTextId;
    };

    $scope.setSelectedTextId = function(txtId) {
      selectedTextId = txtId;
    };

    // TODO : get this from server
    $scope.getTextRanking = function(txt) {
      return !! selectedTextId ?  txt.rank : '?';
    };

  }]);
