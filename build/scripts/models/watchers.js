'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var watchers = {
	__constructor: function __constructor() {},


	Data: undefined,

	page: function page() {
		var _page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
		var sortBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
		var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'DESC';

		// get all items (clone array)
		var items = JSON.parse(JSON.stringify(pg.models.storage.Data.watchers));

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

		var i = watchers.getIndexById(id);
		return i === -1 ? -1 : original ? pg.models.storage.Data.watchers[i] : JSON.parse(JSON.stringify(pg.models.storage.Data.watchers[i]));
	},
	delete: function _delete() {
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		return new Promise(function (resolve) {
			console.log('[Model]:watchers.delete(): deleting watcher #' + id);
			// get index in array
			var i = watchers.getIndexById(id);
			// block if  id NOT found
			if (i === -1) resolve(false);
			// remove item from Data array
			pg.models.storage.Data.watchers.splice(i, 1);
			// request to save new data
			pg.models.storage.sync.watchers().then(function (r) {
				return resolve(true);
			});
		});
	},
	save: function save(watcher) {
		return new Promise(function (resolve) {
			console.log('[Model]:watchers.save(): saving watcher #' + watchers.id);
			var i = watchers.getIndexById(watcher.id);
			if (i === -1) i = pg.models.storage.Data.watchers.length;
			pg.models.storage.Data.watchers[i] = watcher;
			pg.models.storage.sync.watchers().then(function (r) {
				return resolve(true);
			});
		});
	},
	new: function _new() {
		return {
			id: pg.guid(),
			name: undefined,
			categories: [],
			directives: [{
				in: 'title',
				has: undefined
			}]
		};
	},
	getIndexById: function getIndexById(id) {
		return pg.models.storage.Data.watchers.findIndex(function (watcher) {
			return watcher.id === id ? true : false;
		});
	}
};

exports.default = watchers;
//# sourceMappingURL=watchers.js.map
