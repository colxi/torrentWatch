'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// Changes XML to JSON
var _JSON = {
	parseXML: function parseXML() {
		var xml = arguments.length <= 0 || arguments[0] === undefined ? document.createElement('xml') : arguments[0];
		var convertCDATAtoTEXT = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
		} else if (xml.nodeType === 4) {
			// CDATA_SECTION_NODE
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (convertCDATAtoTEXT && nodeName === '#cdata-section') nodeName = '#text';
				if (typeof obj[nodeName] === 'undefined') obj[nodeName] = _JSON.parseXML(item, convertCDATAtoTEXT);else {
					if (typeof obj[nodeName].push === 'undefined') {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(_JSON.parseXML(item, convertCDATAtoTEXT));
				}
			}
		}
		return obj;
	}
};

exports.default = _JSON.parseXML;
//# sourceMappingURL=parseXML.js.map
