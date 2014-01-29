cherryApp.directive('historyback', function () {
	return {
		restrict: 'ECMA',
		link: function(scope, element, attrs) {
			$(element[0]).on('click', function() {
				history.back();
				scope.$apply();
			});
		}
	};
});


cherryApp.directive('actionLocation', function() {
	return {
		controller: function($scope, $attrs, PostActionSvc) {
			this.postAction = function(targetType, targetId, actionType, targetParameters) {
				// Post the given action using the action extracted from this directive
				PostActionSvc.postActionInfo(targetType, targetId, $attrs.actionLocation, actionType, targetParameters);
			};
		}
	};
});

cherryApp.directive('a', function() {
	return {
		restrict: 'E',
		require: '?^actionLocation',
		link: function(scope, element, attrs, actionLocation) {

			if ( actionLocation ) {
				element.on('click', function(ev) {
					// If not provided explicitly by attributes on the <a> we guess the params from the href:
					// :targetType/:targetId/:targetParameters...
					var pathParts = attrs.href.split('/');
					var targetType = attrs.targetType || pathParts.shift();
					var targetId = attrs.targetId || pathParts.shift();
					var actionType = attrs.actionType || 'click';
					var targetParameters = attrs.targetParameters || pathParts.join('/');

					actionLocation.postAction(targetType, targetId, actionType, targetParameters);
				});
			}
		}
	};
});

cherryApp.directive('button', function() {
	return {
		restrict: 'E',
		require: '?^actionLocation',
		link: function(scope, element, attrs, actionLocation) {

			if ( actionLocation ) {
				element.on('click', function(ev) {
					// If not provided explicitly by attributes on the <a> we guess the params from the href:
					// :targetType/:targetId/:targetParameters...
					var actionParts = /([^.]+)\.([^(]+)\(([^)]*)\)/.exec(attrs.ngClick);
					var targetType = attrs.targetType || actionParts[1];
					var targetId = attrs.targetId || actionParts[2];
					var actionType = attrs.actionType || 'click';
					var targetParameters = attrs.targetParameters || actionParts[3];

					actionLocation.postAction(targetType, targetId, actionType, targetParameters);
				});
			}
		}
	};
});


// http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs
//cherryApp.directive('focusMe', function($timeout, $parse) {
//	return {
//		//scope: true,   // optionally create a child scope
//		link: function(scope, element, attrs) {
//			var model = $parse(attrs.focusMe);
//			scope.$watch(model, function(value) {
//				console.log('value=',value);
//				if(value === true) {
//					$timeout(function() {
//						element[0].focus();
//					});
//				}
//			});
//			// to address @blesh's comment, set attribute value to 'false'
//			// on blur event:
//			element.bind('blur', function() {
//				console.log('blur');
//				scope.$apply(model.assign(scope, false));
//			});
//		}
//	};
//});

cherryApp.directive('focusMe', function($timeout) {
	return {
		link: function(scope, element, attrs) {
			scope.$watch(attrs.focusMe, function(value) {
				if(value === true) {
					console.log('value=',value);
					//$timeout(function() {
					element[0].focus();
					scope[attrs.focusMe] = false;
					//});
				}
			});
		}
	};
});

// This one wokrs...the first time..but no good results on Androïd
//cherryApp.directive('focusMe', function($timeout) {
//	return function(scope, element, attrs) {
//		scope.$watch(attrs.focusMe, function(value) {
//			console.log('focus', value)
//			if(value) {
//				$timeout(function() {
//					element.focus();
//				}, 700);
//			}
//		});
//	};
//});



cherryApp.directive('focused', function(){
	return function(scope, element){
		element[0].focus();
		console.log('focused');
	};
});

cherryApp.directive('angularimage', function() {
	return {
		restrict: 'ECMA',
		link: function(scope, element, attrs) {
			var img = document.createElement('img');
			img.src = 'http://goo.gl/ceZGf';
			// directives as comment
			if (element[0].nodeType === 8) {
				element.replaceWith(img);
			} else {
				element[0].appendChild(img);
			}
		}
	};
});