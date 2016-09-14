'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var feeds = {
	__constructor: function __constructor() {
		return new Promise(function (_resolve) {
			pg.load.model('storage', 'categories').then(function (r) {
				return _resolve(r);
			});
		});
	},
	page: function page() {
		var _page = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

		var limit = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
		var sortBy = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
		var order = arguments.length <= 3 || arguments[3] === undefined ? 'DESC' : arguments[3];

		// get all items (clone array)
		var items = JSON.parse(JSON.stringify(pg.models.storage.Data.feeds));

		// TO DO : sort by key
		// TO DO : apply ASC DESC order

		// if a page is requested, slice array , and select only corresponding items
		if (_page > 0) {
			var firstIndex = _page * limit - limit;
			var lastIndex = firstIndex + limit - 1 < items.length ? firstIndex + limit : items.length;
			items = items.slice(firstIndex, lastIndex);
		}
		// done ! return items;
		return items;
	},
	get: function get() {
		var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
		var original = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		var i = feeds.getIndexById(id);
		return i === -1 ? -1 : original ? pg.models.storage.Data.feeds[i] : JSON.parse(JSON.stringify(pg.models.storage.Data.feeds[i]));
	},
	delete: function _delete() {
		var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

		return new Promise(function (resolve) {
			console.log('[Model]:feeds.delete(): deleting feed #' + id);
			// get index in array
			var i = feeds.getIndexById(id);
			// block if  id NOT found
			if (i === -1) resolve(false);
			// remove item from Data array
			pg.models.storage.Data.feeds.splice(i, 1);
			// request to save new data
			pg.models.categories.updateFeedCount();
			pg.models.storage.sync.feeds().then(function (r) {
				return resolve(true);
			});
		});
	},
	save: function save(feed) {
		return new Promise(function (resolve) {
			console.log('[Model]:feeds.save(): saving feed #' + feed.id);
			var i = feeds.getIndexById(feed.id);
			if (i === -1) i = pg.models.storage.Data.feeds.length;
			pg.models.storage.Data.feeds[i] = feed;
			pg.models.categories.updateFeedCount();
			pg.models.storage.sync.feeds().then(function (r) {
				return resolve(true);
			});
		});
	},
	new: function _new() {
		return {
			id: pg.guid(),
			name: undefined,
			url: undefined,
			fields: {
				available: [],
				assignations: {
					title: undefined,
					magnet: undefined,
					url: undefined
				}
			},
			categories: [],
			TTL: 120,
			status: {
				lastCheck: undefined,
				code: undefined,
				details: undefined
			}
		};
	},
	getItemsProperties: function getItemsProperties(feed) {
		var prop = [];
		for (var i in feed.rss.channel.item[0]) {
			if (feed.rss.channel.item[0].hasOwnProperty(i) && i.charAt(0).match(/[A-Z|a-z]/i)) prop.push(i);
		}
		return prop;
	},
	getIndexById: function getIndexById(id) {
		return pg.models.storage.Data.feeds.findIndex(function (feed) {
			return feed.id === id ? true : false;
		});
	}
};

exports.default = feeds;
//# sourceMappingURL=feeds.js.map
