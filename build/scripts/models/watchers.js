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
		var _page = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

		var count = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
		var sortBy = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
		var order = arguments.length <= 3 || arguments[3] === undefined ? 'DESC' : arguments[3];

		return new Promise(function (_resolve) {
			chrome.storage.sync.get('watchers', function (r) {
				return _resolve(r);
			});
		});
	},
	get: function get() {
		var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	},
	delete: function _delete() {
		var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	},
	save: function save(w) {
		console.log('app.saveWatcher(): saving watcher');
		var i = watchers.getIndexById(w.id);
		if (i === -1) i = watchers.Data.length;
		watchers.Data.watchers[i] = w;
		chrome.storage.sync.set({ 'watchers': watchers.Data }, function (r) {
			// Notify that we saved.
			console.log('Settings saved', r);
		});
		return true;
	},
	new: function _new() {
		return {
			id: undefined,
			name: undefined,
			categories: [],
			directives: [{
				in: 'title',
				has: undefined
			}]
		};
	},
	getIndexById: function getIndexById(id) {
		return watchers.Data.findIndex(function (watcher) {
			return watcher.id === id ? true : false;
		});
	}
};

exports.default = watchers;
//# sourceMappingURL=watchers.js.map
