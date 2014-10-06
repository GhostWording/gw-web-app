var config = 
	{
		all:{
			"API_URL": "http://api.cvd.io/",
			"CDN_URL": "http://az672411.vo.msecnd.net/"
		},
		debug: {
		},
		release: {
		},
		deploy: {
			"API_URL": "/api/"
		}
	};

module.exports = {
	get: function(key, target) {
		if(!target) target = 'all';
		if(!config[target]) {
			throw new Error('config target ' + target + ' not found');
		}
		var value = config[target][key];
		if(target!='all' && !value) {
			value = config.all[key];
		}
		if(!value) {
			throw new Error('config value not found for key ' + key + ' in target ' + target);
		}
		return value;
	},
	getAll: function(target) {
		if(!target) target = 'all';
		if(!config[target]) {
			throw new Error('config target ' + target + ' not found');
		}
		var values = {};
		for (var key in config['all']) {
			if (config['all'].hasOwnProperty(key)) {
				values[key] = config['all'][key];
			}
		}
		for (var key in config[target]) {
			if (config[target].hasOwnProperty(key)) {
				values[key] = config[target][key];
			}
		}
		return values;
	}
}
