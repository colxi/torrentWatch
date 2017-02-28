'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var categories = {
	__constructor: function __constructor() {
		return new Promise(function (_resolve) {
			pg.load.model('storage').then(function (r) {
				return _resolve(r);
			});
		});
	},
	page: function page() {
		var _page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
		var sortBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
		var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'DESC';

		// get all items (clone array)
		var items = JSON.parse(JSON.stringify(pg.models.storage.Data.categories));

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
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var original = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var i = categories.getIndexById(id);
		return i === -1 ? -1 : original ? pg.models.storage.Data.categories[i] : JSON.parse(JSON.stringify(pg.models.storage.Data.categories[i]));
	},
	getByName: function getByName(name) {
		for (var i = 0; i < pg.models.storage.Data.categories.length; i++) {
			if (pg.models.storage.Data.categories[i].name === name) return pg.models.storage.Data.categories[i];
		}
		return -1;
	},
	delete: function _delete() {
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		return new Promise(function (resolve) {
			console.log('[Model]:categories.delete(): deleting feed #' + id);
			// get index in array
			var i = categories.getIndexById(id);
			// block if  id NOT found
			if (i === -1) resolve(false);
			// remove item from Data array
			pg.models.storage.Data.categories.splice(i, 1);
			// request to save new data
			pg.models.storage.sync.categories().then(function (r) {
				return resolve(true);
			});
		});
	},
	save: function save(category) {
		return new Promise(function (resolve) {
			console.log('[Model]:categories.save(): saving category #' + category.id);
			var i = categories.getIndexById(category.id);
			if (i === -1) i = pg.models.storage.Data.categories.length;
			pg.models.storage.Data.categories[i] = category;
			categories.updateFeedCount();
			pg.models.storage.sync.categories().then(function (r) {
				return resolve(true);
			});
		});
	},
	new: function _new() {
		return {
			id: pg.guid(),
			name: undefined,
			feeds: 0
		};
	},
	updateFeedCount: function updateFeedCount() {
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		var _update = function _update(id) {
			var category = categories.get(id);
			if (category === -1) return -1;

			category.feeds = 0;
			for (var i = 0; i < pg.models.storage.Data.feeds.length; i++) {
				if (pg.models.storage.Data.feeds[i].categories.indexOf(id) !== -1) category.feeds++;
			}return category.feeds;
		};
		if (typeof id === 'undefined') for (var i = 0; i < pg.models.storage.Data.categories.length; i++) {
			_update(pg.models.storage.Data.categories[i].id);
		} else _update(id);
		return true;
	},
	getIndexById: function getIndexById(id) {
		return pg.models.storage.Data.categories.findIndex(function (category) {
			return category.id === id ? true : false;
		});
	}
};

exports.default = categories;
//# sourceMappingURL=categories.js.map
