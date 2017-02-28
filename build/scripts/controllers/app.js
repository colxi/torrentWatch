'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var clock = null;

var app = {
	__constructor: function __constructor() {
		var _this = this;

		pg.log('app.__constructor(): Application Controller Initialization started.');
		pg.log('app.__constructor(): Importing App Modules & dependencies...');
		return new Promise(function (resolve) {
			// load some required pg modules
			pg.load.module('JSON/parseXML', 'FORM/validation').then(function (r) {
				return pg.load.model('storage', 'feedContents');
			})
			// get all Feeds Contents
			.then(function (r) {
				return pg.models.feedContents.getAll(true);
			}).then(function (r) {
				// make form validation resources bindable
				_this.regExp = pg.FORM.validation.pattern;
				_this.regExpInfo = pg.FORM.validation.title;
				// schedule feedcontents update...
				for (var i = 0; i < pg.models.storage.Data.feeds.length; i++) {
					var feed = pg.models.storage.Data.feeds[i];
					pg.log('app.__constructor(): Scheduling Feed Refresh : ' + feed.id + ' (TTL : ' + feed.TTL + ')');
					pg.models.feedContents.tasks[feed.id] = setInterval(function (id) {
						pg.log('[Scheduled Task]: Refreshing FeedContents for feed #' + id);
						pg.models.feedContents.get(id, true).then(function (r) {
							return pg.models.feedContents.checkInFeed(id);
						});
					}.bind(undefined, feed.id), feed.TTL * 60 * 1000);
				}
				_this.readyState = 'complete';
				resolve(true);
			});
		});
	},


	readyState: 'loading',

	config: {},

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
