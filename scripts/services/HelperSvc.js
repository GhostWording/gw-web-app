// Usefull stateless functions

cherryApp.factory('HelperService',[function(){
	// Application signature
	var signatureAppli = "Ecrit avec www.CommentVousDire.com";
	var urlAppli = "http://www.commentvousdire.com";
	// Max tweet size
	var MAX_TWEET = 141;
    // The type of content we want to display for a text
    var TxtDisplayModeEnum = {
        Abstract: 0,
        ContentNormal : 1,
        ContentQuote: 2
    };

	return {
        TxtDisplayModeEnum : TxtDisplayModeEnum,
        shouldDisplayAsCitation : function(txt) {
            var retval = TxtDisplayModeEnum.ContentNormal;
            if (txt === undefined)
                return retval;
            //if ( txt.Author != 'Franck Pelé' && txt.Author !== undefined && txt.Author != 'Inconnu' )
            if ( txt.IsQuote )
                retval = TxtDisplayModeEnum.ContentQuote;
            return retval;
        },
        isQuote : function(txt) {
          if ( txt === undefined )
            return false;
          return   this.shouldDisplayAsCitation(txt) == TxtDisplayModeEnum.ContentQuote;
        },
		isIPhone: function () {
			var retval = false;
			if (navigator.userAgent.indexOf('iPhone') != -1)
				retval = true;
			return retval;
		},
		// Returns 0, 1, 2 ......one line number per line
		getLineNumbers: function (items, nbColumnsPerLine) {
			var i = 0;
			var li = [];
			angular.forEach(items,
				function (item) {
					if (i % nbColumnsPerLine === 0)
						li.push(item);
					i++;
				});
			return li;
		} ,
		// Returns items for the given line
		getLineElementsForLineNumber: function (items, lineNumber, nbColumnsPerLine)  {
			var i = 0;
			var col = [];
			angular.forEach(items, function (item) {
				// Les éléments de la ligne courante
				if (Math.floor(i / nbColumnsPerLine) == lineNumber)
					col.push(item);
				i++;
			});
			return col;
		},
        // Creates an array indexed on one of the properties of the source
		buildIndex: function(source, property) {
			var tempArray = [];
			for(var i = 0, len = source.length; i < len; ++i) {
				tempArray[source[i][property]] = source[i];
			}
			return tempArray;
		},
		// Shuffles an array, http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
		shuffle: function(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;
			// While there remain elements to shuffle...
			while (0 !== currentIndex) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		},
        // Shuffles texts when SortBy property about a threashold
		shuffleTextIfSortOrderNotLessThan: function(textArray, mustBeUnderThisToStayInOrder) {
			var under = [];
			var equalOrOver = [];
			for (var i = 0; i < textArray.length; i++)
			{
				if ( textArray[i].SortBy < mustBeUnderThisToStayInOrder )
					under.push(textArray[i]);
				else
					equalOrOver.push(textArray[i]);
			}
			this.shuffle(equalOrOver);
			var retval = under.concat(equalOrOver);
			return retval;
		},

        // What the app url that will be added to user messages
		getSignatureAppli: function () {
			return signatureAppli;
		},
		addSignatureAppli: function (txt) {
			return txt + "\n\n" + signatureAppli;
		},
		replaceEndOfLines: function (input) {
			return input.replace(/[\r\n]/g, "%0A");
		},
		urlMailTo: function (txt,intentionTxt) {
			var t = this.addSignatureAppli(txt);
			var rootUrl = "mailto:?subject=" + intentionTxt + "&body=" + t;
			rootUrl = this.replaceEndOfLines(rootUrl);
			return rootUrl;
		},
		mailTo: function (txt,intentionTxt) {
			if ( txt !== undefined && intentionTxt !== undefined )
			{
			window.open(this.urlMailTo(txt,intentionTxt), '_blank');
			}
		},
		urlSMSTo: function (txt) {
			var t = this.addSignatureAppli(txt);
			var rootUrl = "sms:?body=" + t;
			rootUrl = this.replaceEndOfLines(rootUrl);
			return rootUrl;
		},
		sms:  function (txt) {
			if ( txt !== undefined )
				window.open(this.urlSMSTo(txt), '_blank');
		},
		canTweet: function (txt) {
			if ( txt !== undefined)
				return txt.length < MAX_TWEET;
			else
				return false;
		},
		urlTweetTo: function (txt) {
			var rootUrl = "http://twitter.com/home?status=" + txt;
			rootUrl = this.replaceEndOfLines(rootUrl);
			return rootUrl;
		},
		tweet: function (txt) {
			if ( txt !== undefined )
			{
				window.open(this.urlTweetTo(txt), '_blank');
			}
		}

	};

}]);