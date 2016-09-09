'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var app = {
	__constructor: function __constructor() {
		var _this = this;

		pg.log('[Model]:app.__constructor(): Application Controller Initialization started.');
		pg.log('[Model]:app.__constructor(): Importing App Modules & dependencies...');
		return new Promise(function (resolve) {
			// load some required pg modules
			pg.load.module('JSON/parseXML', 'FORM/validation').then(function (r) {
				return pg.load.model('storage', 'feedContents');
			})
			// get all Feeds Contents
			.then(function (r) {
				return pg.models.feedContents.get();
			})
			// schedule automatic Feed Contents update
			.then(function (r) {
				return pg.models.feedContents.scheduleUpdates();
			}).then(function (r) {
				// make form validation resources bindable
				_this.regExp = pg.FORM.validation.pattern;
				_this.regExpInfo = pg.FORM.validation.title;
				resolve(true);
			});
		});
	},


	location: 'categories',

	regExp: {},

	regExpInfo: {},

	Data: {
		watchers: [{
			id: '2d6f8f0c-7cad-252c-5d67-df637b07b62cd Goo	4',
			name: 'ghostbusters',
			categories: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
			directives: [{
				in: 'title',
				has: 'ghostbusters'
			}]
		}],
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
		}]
	},

	emptyCategory: function emptyCategory() {
		return {
			id: undefined,
			name: undefined,
			feeds: 0
		};
	},
	saveCategory: function saveCategory(c) {
		console.log('app.saveCategory(): saving category');
		var i = app.getCategoryIndexById(c.id);
		if (i === -1) i = app.Data.categories.length;
		app.Data.categories[i] = c;
		app.countFeedsinAllCategories();
		return true;
	},
	deleteCategory: function deleteCategory(id) {
		console.log('app.deleteCategory(): deleting category');
		var i = app.getCategoryIndexById(id);
		if (i === -1) return false;
		app.Data.categories.splice(i, 1);
		app.countFeedsinAllCategories();
		return true;
	},
	getCategoryById: function getCategoryById(id) {
		var i = app.Data.categories.findIndex(function (cat) {
			return cat.id === id ? true : false;
		});
		return i === -1 ? -1 : app.Data.categories[i];
	},
	getCategoryIndexById: function getCategoryIndexById(id) {
		return app.Data.categories.findIndex(function (category) {
			return category.id === id ? true : false;
		});
	},
	getCategoryByName: function getCategoryByName(id) {
		var i = app.Data.categories.findIndex(function (cat) {
			return cat.name === id ? true : false;
		});
		return i === -1 ? -1 : app.Data.categories[i];
	},


	// models.categories.updateFeedCount
	updateFeedCount: function updateFeedCount() {
		var id = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

		var _update = function _update(id) {
			var category = app.getCategoryById(id);
			if (category === -1) return -1;

			category.feeds = 0;
			for (var i = 0; i < app.Data.feeds.length; i++) {
				if (app.Data.feeds[i].categories.indexOf(id) !== -1) category.feeds++;
			}return category.feeds;
		};
		if (typeof id === 'undefined') for (var i = 0; i < app.Data.categories.length; i++) {
			_update(app.Data.categories[i].id);
		} else _update(id);
		return true;
	},


	getFeedItemsProperties: function getFeedItemsProperties(feed) {
		var prop = [];
		for (var i in feed.rss.channel.item[0]) {
			if (feed.rss.channel.item[0].hasOwnProperty(i) && i.charAt(0).match(/[A-Z|a-z]/i)) prop.push(i);
		}
		return prop;
	},

	toogleArrayItem: function toogleArrayItem(item, array, event, object) {
		var i = array.indexOf(item);
		if (i === -1) array.push(item);else array.splice(i, 1);
		console.log(arguments);
	}
};

exports.default = app;
//# sourceMappingURL=app.js.map
