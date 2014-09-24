var glob = require('glob');
var gUtil = require('gulp-util');

function getSeleniumServerPath() {
	var seleniumServerPaths = glob.sync('node_modules/protractor/selenium/selenium-server-standalone*.jar');
	if(seleniumServerPaths.length === 0) {
		gUtil.beep();
		gUtil.log(gUtil.colors.red('unable to find the selenium server in node_modules/protractor/selenium'));
		return '';
	}
	var seleniumServerPath = seleniumServerPaths[0];
	gUtil.log('found selenium server [' + seleniumServerPath + ']');
	return seleniumServerPath;
}

exports.config = {
  // The address of a running selenium server.
  seleniumServerJar: getSeleniumServerPath(),
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },
  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
