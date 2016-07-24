/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg */

'use strict';

window.onload = function () {
	chrome.runtime.getBackgroundPage(function (back) {
		//		pg = backgroundPage.pg;
		back.app.popUpInit();
		/*
  app = back.app;
  		app.binder = rivets;
  app.bind = rivets.bind;
  app.watch = sightglass;
  		app.binder.configure({
  	prefix: 'rv', 					// Attribute prefix in templates
  	preloadData: true,				// Preload templates with initial data on bind
  	rootInterface: '.',				// Root sightglass interface for keypaths
  	templateDelimiters: ['{', '}'],	// Template delimiters for text bindings
  	// Augment the event handler of the on-* binder
  	handler: function(target, ev, binding) { return this.call(target, event, binding.view.models,binding); }
  });
  app.bind( document.querySelector('#app-wrapper') , { 'app' : app } );
  */
	});
};
//# sourceMappingURL=popup.js.map
