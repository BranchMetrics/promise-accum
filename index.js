function $(name) {
	function _$(params) {
		var accumulator = function(name) {
			return function(value) {
				var params2 = {};
				for (var k in params) {
					if (params.hasOwnProperty(k)) { params2[k] = params[k]; }
				}
				params2[name] = value;
				return _$(params2);
			};
		};
		for (var k in params) {
			if (params.hasOwnProperty(k)) { accumulator[k] = params[k]; }
		}
		accumulator.passthrough = function($) { return $; };

		return accumulator;
	}

	return _$({})(name);
}

$.passthrough = function($) { return $; };

module.exports = $;
