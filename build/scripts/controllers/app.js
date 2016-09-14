'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var app = {
	__constructor: function __constructor() {
		var _this = this;

		pg.log('[Model]:app.__constructor(): Application Controller Initialization started.');
		pg.log('[Model]:app.__constructor(): Importing App Modules & dependencies...');
		return new Promise(function (resolve) {
			// load some required pg modules
			pg.load.module('JSON/parseXML', 'FORM/validation').then(function (r) {
				return pg.load.model('storage', 'feedContents');
			})
			// get all Feeds Contents
			.then(function (r) {
				return pg.models.feedContents.get();
			})
			// schedule automatic Feed Contents update
			.then(function (r) {
				return pg.models.feedContents.scheduleUpdates();
			}).then(function (r) {
				// make form validation resources bindable
				_this.regExp = pg.FORM.validation.pattern;
				_this.regExpInfo = pg.FORM.validation.title;
				resolve(true);
			});
		});
	},


	location: 'categories',

	regExp: {},

	regExpInfo: {},

	toogleArrayItem: function toogleArrayItem(item, array, event, object) {
		var i = array.indexOf(item);
		if (i === -1) array.push(item);else array.splice(i, 1);
		console.log(arguments);
	}
};

exports.default = app;
//# sourceMappingURL=app.js.map
