'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass, app */

// let main extends pg.__Controller{
var app = {
	__constructor: function __constructor() {
		var _this = this;

		return new Promise(function (resolve, reject) {
			pg.log('*** Starting Torrent Observer v.' + pg.getVersion());

			// require module libraries
			pg.log('main.__constructor() : Requiring JSON.parseXML...');
			pg.require('lib/JSON.parseXML').then(function (r) {
				_this.countFeedsinAllCategories();
				_this.getAllFeeds().then(function (r) {
					resolve();
				});
			});
		});
	},


	location: 'categories',

	Data: {
		categories: [{
			id: 'f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7',
			name: 'movies',
			feeds: 0
		}, {
			id: 'dd63224e-b59c-4b41-5f99-c63cffbbafe4',
			name: 'music',
			feeds: 0
		}, {
			id: '44748d67-be92-47a9-a5b6-de502f1e8cb5',
			name: 'software',
			feeds: 0
		}, {
			id: '91aa33c5-5099-48e8-b6a4-4a5946c0b617',
			name: 'others',
			feeds: 0
		}],
		feeds: [{
			id: 'a34d24b3-cc2f-6add-b2f0-5ebe9ac0f521',
			name: 'Mininova Movies',
			url: 'http://www.mininova.org/rss.xml?cat=4',
			properies: ['title'],
			TTL: 10,
			categories: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
			lastUpdate: null
		}, {
			id: 'bdv424b6-cb1c-3aab-11b3-ac429bb0f530',
			name: 'YIFY Movies',
			url: 'https://yts.ag/rss',
			properies: ['title'],
			TTL: 10,
			categories: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
			lastUpdate: null
		}]
	},

	getCategoryById: function getCategoryById(id) {
		var i = this.Data.categories.findIndex(function (cat) {
			return cat.id === id ? true : false;
		});
		return i === -1 ? -1 : this.Data.categories[i];
	},
	getCategoryByName: function getCategoryByName(id) {
		var i = this.Data.categories.findIndex(function (cat) {
			return cat.name === id ? true : false;
		});
		return i === -1 ? -1 : this.Data.categories[i];
	},
	countFeedsinCategory: function countFeedsinCategory(id) {
		var category = this.getCategoryById(id);
		if (category === -1) return -1;

		category.feeds = 0;
		for (var i = 0; i < this.Data.feeds.length; i++) {
			if (this.Data.feeds[i].categories.indexOf(id) !== -1) category.feeds++;
		}return category.feeds;
	},
	countFeedsinAllCategories: function countFeedsinAllCategories() {
		for (var i = 0; i < this.Data.categories.length; i++) {
			this.countFeedsinCategory(this.Data.categories[i].id);
		}return true;
	},
	getAllFeeds: function getAllFeeds() {
		var _this2 = this;

		return new Promise(function (_resolve, _reject) {
			pg.log('pg.updateAllFeeds(): Updating all Feeds...');
			var currentFeed = -1;
			// Loop through the Feeds with array.reduce...
			_this2.Data.feeds.reduce(function (sequence) {
				return sequence.then(function () {
					currentFeed++;
					return _this2.getFeed(currentFeed);
				}).then(function (result) {
					if (result) pg.log('pg.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + _this2.Data.feeds[currentFeed].name + ' UPDATED');else pg.log('pg.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + _this2.Data.feeds[currentFeed].name + ' FAILED');
					if (currentFeed + 1 === _this2.Data.feeds.length) _resolve();
				});
			}, Promise.resolve());
		});
	},
	getFeed: function getFeed(i) {
		var _this3 = this;

		return new Promise(function (_resolve, _reject) {
			if (i === undefined || i === null || i === '') return _reject(-1);

			// get feed (allow feed array index or string url feed)
			var feed = void 0;
			if (isNaN(i) && typeof i === 'string') feed = { url: i, name: '***' };else feed = _this3.Data.feeds[i];

			// block if requested feed does not exist
			if (feed === undefined) return _reject(-1);

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
				var JSONxml = JSON.parseXML(xmlDoc);

				request = null;
				return _resolve(JSONxml);
			};
			// RESPONSE FAIL
			request.onerror = function () {
				pg.log('pg.getFeed(): Error on request.', request.statusText);
				request = null;
				return _resolve(false);
			};
			// Send Request
			request.send(null);
		});
	},
	toogleArrayItem: function toogleArrayItem(item, array, event, object) {
		var i = array.indexOf(item);
		if (i === -1) array.push(item);else array.splice(i, 1);
		console.log(arguments);
	}
};

exports.default = app;
//# sourceMappingURL=app.js.map
