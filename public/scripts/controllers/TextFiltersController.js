
cherryApp.controller('TextFiltersController', ['$scope', '$filter','TheTexts','NormalTextFilters','PostActionSvc','SelectedIntention','SelectedArea',function ($scope, $filter,TheTexts,TextFilters,PostActionSvc,SelectedIntention,SelectedArea) {

   $scope.PostBox = PostActionSvc;

    // Reset text filters : this duplicates initialisation in TextListController to try and  display initialisation bug
//    TextFilters.initializeFiltersToUndefined();

    $scope.BasicFilters = TextFilters;


    //console.log('TextFiltersController');
	$scope.fake = function () {
		console.log('fake');
	};

    $scope.AtLeastOneStyleToExclude = TextFilters.atLeastOneStyleToExclude;

    $scope.AtLeastOneStyleToPrefer = TextFilters.atLeastOneStyleToPrefer

    $scope.showBreadcrumbs = function () {
        return TextFilters.getHideRecipientGender() || TextFilters.getHideCloseness() || TextFilters.getHideTuOuVous() ;
    };

    $scope.getSenderGenderLabel = function () {
        var code = TextFilters.getSenderGender();
        var valret = "...";
        switch (code) {
            case 'H' :
                valret = 'Homme';
                break;
            case 'F' :
                valret = 'Femme';
                break;
            case 'I' :
                valret = '...';
                break;
            default :
                valret = 'Oups';
                break;
        }
        return valret;
    };
    $scope.getSenderGenderIconName = function() {
        var code = TextFilters.getSenderGender();
        var valret = "...";
        switch (code) {
            case 'H' :
                valret = 'maleuser32.png';
                break;
            case 'F' :
                valret = 'femaleuser32.png';
                break;
            case 'I' :
                valret = '...';
                break;
            default :
                valret = 'Oups';
                break;
        }
        return valret;
    };
    $scope.getRecipientGenderLabel = function () {
        var genderCode = TextFilters.getRecipientGender();
        var valret = "...";
        switch (genderCode) {
            case 'H' :
                valret = 'Un';
                break;
            case 'F' :
                valret = 'Une';
                break;
            case 'P' :
                valret = 'Plusieurs';
                break;
            case 'I' :
                valret = '...';
                break;
            default :
                valret = 'Oups';
                break;
        }
        return valret;
    };
    $scope.getRecipientGenderIconName = function () {
        var genderCode = TextFilters.getRecipientGender();
        var valret = "...";
        switch (genderCode) {
            case 'H' :
                valret = 'maleuser32.png';
                break;
            case 'F' :
                valret = 'femaleuser32.png';
                break;
            case 'P' :
                valret = 'several32.png';
                break;
            case 'I' :
                valret = 'maleuser32.png'; // ...
                break;
            default :
                valret = 'Oups';
                break;
        }
        return valret;
    };
    $scope.getClosenessLabel = function () {
        var code = TextFilters.getCloseness();
        var recipiendGenderCode = TextFilters.getRecipientGender();

        var valret = "...";
        switch (code) {
            case 'P' :
                valret = 'proche';
                if ( recipiendGenderCode == 'P')
                    valret += 's';
                break;
            case 'D' :
                valret = 'pas proche';
                if ( recipiendGenderCode == 'P')
                    valret += 's';
//                if ( recipiendGenderCode == 'F')
//                    valret += 'e';
                break;
            case 'I' :
                valret = '...';
                break;
            default :
                valret = 'Oups';
                break;
        }
        return valret;
    };
    $scope.getTuOuVousLabel = function () {
        var code = TextFilters.getTuOuVous();
        var valret = "...";
        switch (code) {
            case 'T' :
                valret = 'Dire tu';
                break;
            case 'V' :
                valret = 'Dire vous';
                break;
            default :
                valret = 'Oups';
                break;
        }
        return valret;
    };

	$scope.modifySpellingAccordingToGender = function (genre) {
		if (genre == 'F') {
			TextFilters.libelleReservee = "Réservée";
			TextFilters.libelleExpansive = "Expansive";
		}
		else {
			TextFilters.libelleReservee = "Réservé";
			TextFilters.libelleExpansive = "Expansif";
		}
	};

	$scope.definirGenreExpediteur = function (genre) {
		// TODO : call modifySpellingAccordingToGender by watching an event
		$scope.modifySpellingAccordingToGender(genre);
		TextFilters.setSenderGender(genre);
        $scope.PostBox.gulp('Command','UserGender' + ' : ' + genre ,'TextList');
	};
	$scope.definirGenreDestinataire = function (genre) {
//		TextFilters.genreDestinataire = genre;
		TextFilters.setRecipientGender(genre);

        $scope.PostBox.gulp('Command','RecipientGender' + ' : ' + genre ,'TextList');

        if ( genre == 'P' )
            TextFilters.setTuOuVous('V');
	};
	$scope.definirTuOuVous = function (input) {
//		TextFilters.tuOuVous = input;
		TextFilters.setTuOuVous(input);
        $scope.PostBox.gulp('Command','TuOuVous' + ' : ' + input ,'TextList');

    };
    $scope.definirProximite = function(input) {
        TextFilters.setCloseness(input);
        // Proche mais pas Plusieurs : Close to recipient and not several of them => Tu looks like a good choice
        if ( input == 'P' && TextFilters.getRecipientGender() != 'P')
            TextFilters.setTuOuVous('T');
        $scope.PostBox.gulp('Command','RecipientCloseness' + ' : ' + input ,'TextList');
    };
	$scope.definirCaractere = function (caractere) {
//		TextFilters.caractereUtilisateur = caractere;
		TextFilters.setSenderIsOutgoing(caractere);
	};


    setBestFilterDefaultValues(SelectedArea.getSelectedAreaName() , SelectedIntention.getSelectedIntentionId(), TextFilters.getSenderGender());

    function invertGender(gender) {
        var retval = undefined;

        switch (gender ) {
            case 'H' :
                retval = 'F';
                break;
            case 'F' :
                retval = 'H';
                break;
        }
        return retval;
    }

    function setBestFilterDefaultValues(areaName,intentionId, userGender) {
        console.log (areaName + " - " + intentionId + ' - ' + userGender);

        if ( areaName == 'Sentimental' ) {
            if ( userGender == 'H' || userGender == 'F')
                TextFilters.setRecipientGender(invertGender(userGender));
            // Unless intention is 'I would like to see you again' or new relationship, presume 'Tu' will be adequate
            if ( intentionId != 'BD7387' &&  intentionId != '7445BC')
                TextFilters.setTuOuVous('T');
        }
        if ( areaName == 'Important' ) {
            if ( intentionId !=  'B47AE0' && intentionId !=  '938493' )
                TextFilters.setTuOuVous('T');
        }
        switch (intentionId ) {
            case '0ECC82' : // Exutoire
            case '0B1EA1' : // Jokes
            case 'D19840' : // Venez diner à la maison
            case '451563' : // Stop the world, I want to get off
                TextFilters.setRecipientGender('P');
                TextFilters.setTuOuVous('V');
                break;
            case '016E91' : // Je pense à toi
            case 'D392C1' : // Sleep well
                if ( userGender == 'H' || userGender == 'F')
                    TextFilters.setRecipientGender(invertGender(userGender));
                TextFilters.setTuOuVous('T');
                break;
        }

    }

    $scope.RecipientGender = TextFilters.getRecipientGender;
    $scope.RecipientTuOuVous = TextFilters.getTuOuVous();

//    setBestFilterDefaultValues(areaName,intentionId)

    // Now in text list controller
//    $scope.choseFiltersToDisplay = function() {
//        console.log('choseFiltersToDisplay');
//        TheTexts.setContextFiltersVisibility();
//        $scope.PostBox.gulp('Command','ChoseFilters','TextList');
//    };
}]);

// unused simulation function
//	$scope.zaperDesTextesAuHasard = function (listeEntree, modulo) {
//		var i = 0;
//		var listeSortie = [];
//		angular.forEach(listeEntree, function (texte) {
//			if (i % modulo !== 0)
//				listeSortie.push(texte);
//			i++;
//		});
//		return listeSortie;
//	};