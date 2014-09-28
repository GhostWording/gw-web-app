'use strict';

var fs = require('fs'); 

module.exports = {
	// Replace the postActionSvc with a mock that does 
	// nothing so we avoid polluting the analytics
	disablePostActions: function() {
		browser.addMockModule('postActionSvc', function() {
			var module = angular.module('postActionSvc', []);
			module.factory('postActionSvc', function() {
				return {
					postInitInfo: function() {console.error('ACTION INIT'); return {then:function(){}};},
					postActionInfo: function(targetType, targetId, actionLocation, actionType, targetParameter) {
						var msg = 
							'ACTION: [' + [ 
							'targetType: ' + targetType,
							'targetId: ' + targetId,
							'actionLocation: ' + actionLocation,
							'actionType: ' + actionType,
							'targetParameter: ' + targetParameter].join(' ') + ']';
						console.error(msg);
					}
				};
			});
		});
	},
	// Print out the console from the browser under test
	printBrowserLogs: function() {
		browser.manage().logs().get('browser').then(function(browserLogs) {
			browserLogs.forEach(function(log) {
				console.log(log.message);
			});
		});
	},
	// Take a browser screenshot and write it to disk
	takeScreenshot: function(filename) {
		browser.takeScreenshot().then(function(png) {
			var stream = require('fs').createWriteStream(filename);
			stream.write(new Buffer(png, 'base64'));
			stream.end();
		});
	}
};

