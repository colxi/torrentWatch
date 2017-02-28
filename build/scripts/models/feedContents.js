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
				return pg.load.model('storage', 'feeds');
			}).then(function (r) {
				return _resolve(r);
			});
		});
	},


	Data: {},

	tasks: {},

	checkInFeed: function checkInFeed() {
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
	save: function save() {
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
		var contents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (id === undefined || id === null || id === '') {
			pg.log('[Model]:feedContents.save() : No id provided. Returning...', 'warn');
			return -1;
		}
		pg.log('[Model]:feedContents.save() : Saving feed (' + id + ') Contents...');
		feedContents.Data[id] = contents;
		return true;
	},
	getAll: function getAll() {
		var saveFlag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		return new Promise(function (_resolve, _reject) {
			pg.log('[Model]:feedContents.getAll(): Updating all Feeds...');
			var currentFeed = -1;
			// Loop through the Feeds with array.reduce...
			pg.models.storage.Data.feeds.reduce(function (sequence) {
				return sequence.then(function () {
					currentFeed++;
					return feedContents.get(pg.models.storage.Data.feeds[currentFeed].id, saveFlag);
				}).then(function (result) {
					if (result) pg.log('[Model]:feedContents.getAll(): Feed #' + (currentFeed + 1) + ' ' + pg.models.storage.Data.feeds[currentFeed].name + ' UPDATED');else pg.log('[Model]:feedContents.getAll(): Feed #' + (currentFeed + 1) + ' ' + pg.models.storage.Data.feeds[currentFeed].name + ' FAILED');
					if (currentFeed + 1 === pg.models.storage.Data.feeds.length) _resolve();
				});
			}, Promise.resolve());
		});
	},
	get: function get() {
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
		var saveFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		//
		// TODO: check if was previously cached, if not expired yet
		// return cached data
		//
		return new Promise(function (_resolve) {
			if (id === undefined || id === null || id === '') {
				pg.log('[Model]:feedContents.get() : No id provided. Returning...', 'warn');
				return _resolve(-1);
			}

			// get feed (allow feed Id index or string url feed)
			var f = void 0;

			f = pg.models.feeds.get(id);
			if (f === -1) f = { url: id, name: '***', status: {} };

			f.status.code = 100;
			f.status.details = 'Updating...';
			f.status.lastCheck = new Date();

			pg.log('[Model]:feedContents.get() : Updating Feed from :' + f.url + ' ( ' + f.name + ' )');

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
				f.status.details = 'Update Ok';

				http = null;
				if (!JSONxml.hasOwnProperty('rss') || !JSONxml.rss.hasOwnProperty('channel') || !JSONxml.rss.channel.hasOwnProperty('item')) {
					pg.log('[Model]:feedContents.get(): Invalid XML RSS structure. Aborting...', 'warn');
					return _resolve(-1);
				} else {
					if (saveFlag === true) feedContents.save(id, JSONxml.rss.channel.item);
					return _resolve(JSONxml.rss.channel.item);
				}
			};
			// RESPONSE FAIL
			http.onerror = function (r) {
				pg.log('[Model]:feedContents.get(): Error on request. ' + http.statusText, 'warn');
				f.status.code = 400;
				f.status.details = 'Update Fail';
				f.status.lastCheck = new Date();
				http = null;
				if (saveFlag === true) feedContents.save(id, []);
				return _resolve(false);
			};
			// Send Request
			http.send(null);
		});
	}
};

exports.default = feedContents;
//# sourceMappingURL=feedContents.js.map
