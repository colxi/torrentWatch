/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome */

'use strict';

window.onload = function () {
	var debug = false;
	var _d = document;
	chrome.runtime.getBackgroundPage(function (_w) {
		return _w.rivets.configure_importer({ debug: debug }, _w, _d);
	});
	chrome.runtime.connect({ name: 'popup' });
};
//# sourceMappingURL=popup.js.map
