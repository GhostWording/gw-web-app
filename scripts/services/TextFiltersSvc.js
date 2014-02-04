// This servic keeps track of user choices that impact the filtering of texts
cherryApp.factory('NormalTextFilters', ['$location','UserProfileSvc',function ($location,UserProfileSvc) {

    // We may want to use a list of properties instead of static variables
	var hideSenderGender= true;
	var recipientGender= "I";
	var tuOuVous= "I";
    var closeness="I";

    // Styles that will be filtered out : text matching them will not be displayed
    var stylesToExclude  = {};
    // Text matching those tags will come out on top when texts are sorted
    var stylesToPrefer   = {};
    // If this list of context type tag is not empty, text that do not match one of them will be filtered out
    var contextsToInclude = {};

    var hideStylesToExcludeOrToPrefer = true;

    var filterDialogIsDisplayed = false;

	var o = {};

    o.setDialogIsDisplayed = function (isDisplayed) {
        filterDialogIsDisplayed = isDisplayed;
    };
    o.getDialogIsDisplayed = function () {
        return filterDialogIsDisplayed;
    };

	o.initializeFiltersToUndefined = function () {
		recipientGender = "I";
		tuOuVous = "I";
        closeness = "I";

		hideSenderGender = o.getSenderGender() != "I";
        hideStylesToExcludeOrToPrefer = false;

        stylesToExclude = {};
        stylesToPrefer  = {};
        contextsToInclude = {};
    };

	o.valuesToWatch = function() {
		var valret = o.getSenderGender() + o.getRecipientGender() + o.getTuOuVous() + o.getCloseness() ;
        for (var propertyname in stylesToExclude)
            valret += stylesToExclude[propertyname];
        for (propertyname in stylesToPrefer)
            valret += stylesToPrefer[propertyname];
        valret += o.contextValuesToWatch();
        return valret;
	};
    o.filterValuesToWatch = function() {
        var valret = o.getSenderGender() + o.getRecipientGender() + o.getTuOuVous() + o.getCloseness() ;
        for (var propertyname in stylesToExclude)
            valret += stylesToExclude[propertyname];
        valret += o.contextValuesToWatch();

        return valret;
    };
    o.preferedStylesToWatch = function() {
        var valret = "";
        for (var propertyname in stylesToPrefer)
            valret += stylesToPrefer[propertyname];
        return valret;
    };
    o.contextValuesToWatch = function() {
        var valret = "";
        for (var propertyname in contextsToInclude)
            valret += contextsToInclude[propertyname];
        return valret;
    };

    o.atLeastOneStyleToExclude = function () {
        for (var propertyname in stylesToExclude)
        {
         if ( stylesToExclude[propertyname] === true )
            return true;
        }
        return false;
    };
    o.atLeastOneStyleToPrefer = function () {
        for (var propertyname in stylesToPrefer)
        {
            if ( stylesToPrefer[propertyname] === true )
                return true;
        }
        return false;
    };
    o.atLeastOneContextToInclude = function () {
        for (var propertyname in stylesToExclude)
        {
            if ( contextsToInclude[propertyname] === true )
                return true;
        }
        return false;
    };

    // The sender gender info comes from the UserProfile service
	o.getSenderGender           = function ()  { return UserProfileSvc.getUserGender(); };
	o.setSenderGender           = function (v) { UserProfileSvc.setUserGender(v); };
	o.getHideSenderGender       = function () { return hideSenderGender || UserProfileSvc.getUserGender() != 'I'; };

    // The other filters will typically  be changed each time the user choses from a list of texts
	o.getRecipientGender        = function ()  { return recipientGender; };
	o.setRecipientGender        = function (v) { recipientGender = v; };
	o.getHideRecipientGender    = function () { return o.getRecipientGenderIsDefined() };
    o.getRecipientGenderIsDefined  = function () { return recipientGender != "I"; };

    o.getTuOuVous               = function ()  { return tuOuVous; };
	o.setTuOuVous               = function (v) { tuOuVous = v; };
	o.getHideTuOuVous           = function () {
                                                return o.getTuOuVousIsDefined()
    };
    o.getTuOuVousIsDefined      = function () { return tuOuVous != "I";};


    o.getCloseness              = function ()  { return closeness; };
    o.setCloseness              = function (v) { closeness = v; };
    o.getHideCloseness          = function ()
//                                                { return hideCloseness || closeness != "I"; };
                                                { return closeness != "I"; };

    o.getSylesToExclude         = function()    { return stylesToExclude; };
    o.setStyleToExclude         = function(key,value)
                                                { stylesToExclude[key] = value; };
    o.getSylesToPrefer          = function()    { return stylesToPrefer; };

    o.getStyleToPrefer          = function(key) { var v = stylesToPrefer[key];
                                                 return (v !== undefined) ? v : false; };

    o.setStyleToPrefer          = function(key,value)
                                                { stylesToPrefer[key] = value; };
    o.getContextsToInclude      = function() { return contextsToInclude ; };

    o.getContextToInclude       = function(key) { var v = contextsToInclude[key];
                                                return (v !== undefined) ? v : false; };

    o.setContextToInclude       = function(key,value)
        { contextsToInclude[key]= value; };

    o.recipientFiltersFullyDefined = function() {
        return o.getRecipientGenderIsDefined() && o.getTuOuVousIsDefined();
    };

	return o;
}]);

