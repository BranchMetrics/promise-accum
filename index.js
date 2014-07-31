function createAccum(params) {
	var accumulator = function(name) {
		return function(value) {
			// Create new accumulator with old params + new one.
			var newParams = {};
			for (var k in params) {
				if (params.hasOwnProperty(k)) { newParams[k] = params[k]; }
			}
			newParams[name] = value;
			return createAccum(newParams);
		};
	};

	// Attach parameters to accumulator.
	for (var k in params) {
		if (params.hasOwnProperty(k)) { accumulator[k] = params[k]; }
	}

	accumulator.passthrough = passthrough;
	accumulator.merge = merge;

	return accumulator;
}

// Useful as a replacement for .catch: `.then($.passthrough, errorHandler)`.
function passthrough($) { return $; }

// Merge multiple contexts. Useful in a `.all`.
function merge(accums) {
	if (!Array.isArray(accums)) {
		accums = Array.prototype.slice.apply(arguments);
	}

	// A bit of a hack to get a new instance - set the first key.
	var params = {};

	for (var i = 0; i < accums.length; i++) {
		var source = accums[i];
		for (var prop in source) {
			if (source.hasOwnProperty(prop)) { params[prop] = source[prop]; }
		}
	}

	return createAccum(params);
}

module.exports = function promiseAccum(name) {
	// Initialize accumulator with no params.
	return createAccum({})(name);
};

module.exports.passthrough = passthrough;
module.exports.merge = merge;
