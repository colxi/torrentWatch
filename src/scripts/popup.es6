/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome */

'use strict';
window.onload = function() {
	var _d = document;
	chrome.runtime.getBackgroundPage( _w => _w.rivets.configure_importer({debug:true} , _w , _d) );
	chrome.runtime.connect({name:'popup'});
};
