'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var feedContents = {
	__constructor: function __constructor() {},


	tasks: [],

	scheduleUpdates: function scheduleUpdates() {
		return new Promise(function (_resolve) {
			_resolve();
			/*
   console.log('chromeExt.scheduler.initialize(): Scheduling SYNC for '+ chromeExt.Data.feeds.length+' feeds sources...');
   console.log(chromeExt.Data);
   for(let i=0; i<chromeExt.Data.feeds.length; i++){
       console.log('chromeExt.scheduler.initialize(): Scheduling ' + chromeExt.Data.feeds[i].name +' (TTL : '+ chromeExt.Data.feeds[i].TTL + ' min)');
       chromeExt.scheduler.tasks.push(
           setInterval( function(){
               console.log('checking feed...');
           }, chromeExt.Data.feeds[i].TTL * 60 * 1000)
       );
   }
   */
		});
	},
	getAll: function getAll() {
		return new Promise(function (_resolve, _reject) {
			pg.log('pg.updateAllFeeds(): Updating all Feeds...');
			var currentFeed = -1;
			// Loop through the Feeds with array.reduce...
			app.Data.feeds.reduce(function (sequence) {
				return sequence.then(function () {
					currentFeed++;
					return feedContents.get(app.Data.feeds[currentFeed].id);
				}).then(function (result) {
					if (result) pg.log('pg.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + app.Data.feeds[currentFeed].name + ' UPDATED');else pg.log('pg.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + app.Data.feeds[currentFeed].name + ' FAILED');
					if (currentFeed + 1 === app.Data.feeds.length) _resolve();
				});
			}, Promise.resolve());
		});
	},
	get: function get(id) {
		return new Promise(function (_resolve) {
			_resolve();
		});
		return new Promise(function (_resolve, _reject) {
			if (id === undefined || id === null || id === '') return _reject(-1);

			// get feed (allow feed Id index or string url feed)
			var feed = void 0;

			feed = app.getFeedById(id, true);
			if (feed === -1) feed = { url: id, name: '***', status: {} };

			feed.status.code = 100;
			feed.status.details = 'Updating...';
			feed.status.lastCheck = new Date();

			pg.log('pg.updateFeed() : Updating Feed from :' + feed.url + ' ( ' + feed.name + ' )');

			//
			// Prepare Ajax request
			//
			var request = new XMLHttpRequest();
			request.open('get', feed.url, true);

			// RESPONSE OK
			request.onload = function () {
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(request.responseText, 'text/xml');
				var JSONxml = pg.JSON.parseXML(xmlDoc, true);

				feed.status.code = 200;
				feed.status.details = 'Ok';

				request = null;
				return _resolve(JSONxml);
			};
			// RESPONSE FAIL
			request.onerror = function () {
				pg.log('pg.getFeed(): Error on request... ' + request.statusText);
				feed.status.code = 400;
				feed.status.details = 'Fail';
				request = null;
				return _resolve(false);
			};
			// Send Request
			request.send(null);
		});
	}
};

exports.default = feedContents;
//# sourceMappingURL=feedContents.js.map
