'use strict';

var app, chrome;

(function () {
	'use strict';

	app = {
		/**
   * [description]
   * @param  {[type]} )
   * @return {[type]}   [description]
   */
		_init: document.addEventListener('DOMContentLoaded', function () {
			return app.require('lib/JSON.parseXML').then(function () {
				app.getManifest();
				app.log('Starting Torrent Observer v.' + app.getVersion());

				// set html file for toolbar icon popup
				chrome.browserAction.setPopup({ popup: 'views/popup/popup.html' });
				chrome.browserAction.onClicked.addListener(function () {
					app.popup = chrome.extension.getViews()[1].document;
					app.log('Popup opened');
				});

				app.countFeedsinAllCategories();
				app.getAllFeeds().then(function () {
					app.log('Init done');
				});

				delete app._init;
			});
		}),
		/**
   * [require description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
		require: function () {
			var config = {
				baseUrl: 'scripts/'
			};
			var _require = function _require(src) {
				return new Promise(function (resolve, reject) {
					var filename = src.substring(src.lastIndexOf('/') + 1);
					// if no extension, assume .JS and extract again the filenamename
					if (filename.lastIndexOf('.js') === -1) {
						src = src + '.js';
						filename = src.substring(src.lastIndexOf('/') + 1);
					}
					// Adding the script tag to the head
					var done = false;
					var head = document.getElementsByTagName('head')[0];
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = config.baseUrl + src;
					app.log(script.src);
					script.onload = script.onreadystatechange = function () {
						// attach to both events for cross browser finish detection:
						if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
							// done! execute PROMISE RESOLVE
							done = true;
							// cleans up a little memory, removing listener;
							script.onload = script.onreadystatechange = null;
							resolve();
						}
					};
					// Fire the loading
					head.appendChild(script);
				});
			};
			_require.config = function (custom_config) {
				Object.assign(config, custom_config);
				return true;
			};
			return _require;
		}(),
		/**
   * [feeds description]
   * @type {Array}
   */
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
			id: 'eeed24d2-be2f-42bc-dc3a-3ebf9ba4eff3',
			name: 'Kat (All)',
			url: 'https://kat.cr/?rss=1',
			properies: ['title'],
			TTL: 10,
			categories: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7', 'dd63224e-b59c-4b41-5f99-c63cffbbafe4', '44748d67-be92-47a9-a5b6-de502f1e8cb5'],
			lastUpdate: null
		}, {
			id: 'd44d24b3-af2f-12bd-abaa-2ebf9ba0f5c3',
			name: 'Kat Movies',
			url: 'https://kat.cr/movies/?rss=1',
			properies: ['title'],
			TTL: 10,
			categories: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
			lastUpdate: null
		}, {
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
		}],
		logStore: [],
		log: function log() {
			var msg = arguments.length <= 0 || arguments[0] === undefined ? '{empty}' : arguments[0];
			var method = arguments.length <= 1 || arguments[1] === undefined ? 'log' : arguments[1];

			app.logStore.push(msg);
			console[method](msg);
			return true;
		},
		/**
   * [description]
   * @param  {[type]} ){ return
   * @return {[type]}     [description]
   */
		getManifest: function getManifest() {
			return chrome.app.getDetails();
		},
		getVersion: function getVersion() {
			return chrome.app.getDetails().version;
		},
		getCurrentLocale: function getCurrentLocale() {
			return chrome.app.getDetails().current_locale;
		},
		/**
   * [popup description]
   * @type {[type]}
   */
		popup: null,
		/**
   * [getCategoryById description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
		getCategoryById: function getCategoryById(id) {
			var i = app.categories.findIndex(function (cat) {
				return cat.id === id ? true : false;
			});
			return i === -1 ? -1 : app.categories[i];
		},
		getCategoryByName: function getCategoryByName(id) {
			var i = app.categories.findIndex(function (cat) {
				return cat.name === id ? true : false;
			});
			return i === -1 ? -1 : app.categories[i];
		},
		countFeedsinCategory: function countFeedsinCategory(id) {
			var category = app.getCategoryById(id);
			if (category === -1) return -1;

			category.feeds = 0;
			for (var i = 0; i < app.feeds.length; i++) {
				if (app.feeds[i].categories.indexOf(id) !== -1) category.feeds++;
			}return category.feeds;
		},
		countFeedsinAllCategories: function countFeedsinAllCategories() {
			for (var i = 0; i < app.categories.length; i++) {
				app.countFeedsinCategory(app.categories[i].id);
			}return true;
		},

		/**
   * [updateAllFeeds description]
   * @return {[type]} [description]
   */
		getAllFeeds: function getAllFeeds() {
			return new Promise(function (resolve, reject) {
				app.log('app.updateAllFeeds(): Updating all Feeds...');
				var currentFeed = -1;
				// Loop through the Feeds with array.reduce...
				app.feeds.reduce(function (sequence) {
					return sequence.then(function () {
						currentFeed++;
						return app.getFeed(currentFeed);
					}).then(function (result) {
						if (result) app.log('app.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + app.feeds[currentFeed].name + ' UPDATED (' + result + ')');else app.log('app.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + app.feeds[currentFeed].name + ' FAILED (' + result + ')');
					});
				}, Promise.resolve());
			});
		},
		/**
   * [updateFeed description]
   * @param  {[type]} i [description]
   * @return {[type]}   [description]
   */
		getFeed: function getFeed(i) {
			return new Promise(function (resolve, reject) {
				if (i === undefined || i === null || i === '') return reject(-1);

				// get feed (allow feed array index or string url feed)
				var feed = void 0;
				if (isNaN(i) && typeof i === 'string') feed = { url: i, name: '***' };else feed = app.feeds[i];

				// block if requested feed does not exist
				if (feed === undefined) return reject(-1);

				app.log('app.updateFeed() : Updating Feed from :' + feed.url + ' ( ' + feed.name + ' )');

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
					return resolve(JSONxml);
				};
				// RESPONSE FAIL
				request.onerror = function () {
					app.log('app.getFeed(): Error on request.', request.statusText);
					request = null;
					return resolve(false);
				};
				// Send Request
				request.send(null);
			});
		},
		/**
   * [createGuid description]
   * @return {[type]} [description]
   */
		createGuid: function createGuid() {
			function S4() {
				return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
			}
			// then to call it, plus stitch in '4' in the third group
			return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
		}
	};
})();
//# sourceMappingURL=main.js.map
