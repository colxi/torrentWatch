'use strict';

// Changes XML to JSON
JSON.parseXML = function () {
	var xml = arguments.length <= 0 || arguments[0] === undefined ? document.createElement('xml') : arguments[0];

	// Create the return object
	var obj = {};

	if (xml.nodeType === 1) {
		// element
		// do attributes
		if (xml.attributes.length > 0) {
			obj['@attributes'] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) {
		// text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof obj[nodeName] === 'undefined') obj[nodeName] = JSON.parseXML(item);else {
				if (typeof obj[nodeName].push === 'undefined') {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(JSON.parseXML(item));
			}
		}
	}
	return obj;
};
//# sourceMappingURL=JSON.parseXML.js.map
