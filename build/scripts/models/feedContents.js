'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var feedContents = {
	__constructor: function __constructor() {
		return new Promise(function (_resolve) {
			pg.load.module('JSON/parseXML').then(function (r) {
				return pg.load.model('feeds');
			}).then(function (r) {
				return _resolve(r);
			});
		});
	},


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
			if (id === undefined || id === null || id === '') return _resolve(-1);

			// get feed (allow feed Id index or string url feed)
			var f = void 0;

			f = pg.models.feeds.get(id);
			if (f === -1) f = { url: id, name: '***', status: {} };

			f.status.code = 100;
			f.status.details = 'Updating...';
			f.status.lastCheck = new Date();

			pg.log('pg.updateFeed() : Updating Feed from :' + f.url + ' ( ' + f.name + ' )');

			//
			// Prepare Ajax request
			//
			var http = new XMLHttpRequest();
			http.open('get', f.url, true);

			// RESPONSE OK
			http.onload = function (r) {
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(http.responseText, 'text/xml');
				var JSONxml = pg.JSON.parseXML(xmlDoc, true);

				f.status.code = 200;
				f.status.details = 'Ok';

				http = null;
				return _resolve(JSONxml);
			};
			// RESPONSE FAIL
			http.onerror = function (r) {
				pg.log('pg.getFeed(): Error on request... ' + http.statusText);
				f.status.code = 400;
				f.status.details = 'Fail';
				http = null;
				return _resolve(false);
			};
			// Send Request
			http.send(null);
		});
	}
};

exports.default = feedContents;
//# sourceMappingURL=feedContents.js.map
