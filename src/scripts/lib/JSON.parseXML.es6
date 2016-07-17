// Changes XML to JSON
JSON.parseXML = function(xml = document.createElement('xml') ) {
	// Create the return object
	let obj = {};

	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj['@attributes'] = {};
			for (let j = 0; j < xml.attributes.length; j++) {
				let attribute = xml.attributes.item(j);
				obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(let i = 0; i < xml.childNodes.length; i++) {
			let item = xml.childNodes.item(i);
			let nodeName = item.nodeName;
			if (typeof(obj[nodeName]) === 'undefined')  obj[nodeName] = JSON.parseXML(item);
			else {
				if (typeof(obj[nodeName].push) === 'undefined') {
					let old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(JSON.parseXML(item));
			}
		}
	}
	return obj;
}
