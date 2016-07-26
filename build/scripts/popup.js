/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome */

'use strict';

window.onload = function () {
	chrome.runtime.getBackgroundPage(function (back) {
		back.app.initialize();
	});
};
//# sourceMappingURL=popup.js.map
