'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var storage = {
	__constructor: function __constructor() {
		var _this = this;

		return new Promise(function (resolve) {
			pg.log('[Model]:storage.__constructor() : Preparing for Initial Data Syncronization...');
			chrome.storage.sync.get('feeds', function (f) {
				chrome.storage.sync.get('categories', function (c) {
					chrome.storage.sync.get('watchers', function (w) {
						_this.Data.feeds = f.feeds || [];
						_this.Data.categories = c.categories || [];
						_this.Data.watchers = w.watchers || [];
						pg.log('[Model]:storage.__constructor() : Data Sync done. [' + _this.Data.feeds.length + '] Feeds | [' + _this.Data.categories.length + '] Categories | [' + _this.Data.watchers.length + '] Watchers');
						resolve();
					});
				});
			});
		});
	},


	Data: {
		feeds: [],
		watchers: [],
		categories: []
	},

	onChange: function () {
		return chrome.storage.onChanged.addListener(function (changes, namespace) {
			for (var key in changes) {
				if (!changes.hasOwnProperty(key)) continue;
				var storageChange = changes[key];
				console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".', key, namespace, storageChange.oldValue, storageChange.newValue);
			}
		});
	}(),
	sync: {
		feeds: function feeds() {
			return new Promise(function (resolve) {
				chrome.storage.sync.set({ 'feeds': storage.Data.feeds }, function (r) {
					return resolve(true);
				});
			});
		},
		categories: function categories() {
			return new Promise(function (resolve) {
				chrome.storage.sync.set({ 'categories': storage.Data.categories }, function (r) {
					return resolve(true);
				});
			});
		},
		watchers: function watchers() {
			pg.log('pg.models.storage.get.watchers(): Getting Watchers (useCached=' + useCached + ')');
			return new Promise(function (_resolve) {
				if (!useCached || !storage.Data.watchers) {
					chrome.storage.sync.get('watchers', function (r) {
						storage.Data.watchers = r.watchers || [];
						_resolve(storage.Data.watchers);
					});
				} else _resolve(storage.Data.watchers);
			});
		}
	},
	set: {}
};

exports.default = storage;
//# sourceMappingURL=storage.js.map
