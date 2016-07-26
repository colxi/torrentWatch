'use strict';

System.register([], function (_export, _context) {
	"use strict";

	var main;
	return {
		setters: [],
		execute: function () {
			main = {
				__constructor: function __constructor() {
					var _this = this;

					return new Promise(function (resolve, reject) {
						_this.currentTab = 'tab-feeds';

						// Define pg App Name Reference
						pg.config.appReference = 'app'; // window.app

						// set html file popup
						chrome.browserAction.setPopup({ popup: 'views/popup/popup.html' });

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
				initialize: function initialize() {
					pg.log('main.initialize(): Popup opened! Binding view...');
					// overwrite DOCUMENT with popup document instance
					var document = chrome.extension.getViews({ type: 'popup' })[0].document;
					// Bind & attach rivets view to App controller as non-enumerable property
					var rv_view = pg.bind(document.querySelector('#pg-app'), { 'app': app });
					// if first popup open , assign view; else update binding
					if (!this.hasOwnProperty('__view__')) {
						Object.defineProperty(app, '__view__', {
							value: rv_view,
							enumerable: false,
							writable: true,
							configurable: true
						});
					} else this.__view__.update();
				},
				loadPage: function loadPage(page) {
					/*
     		pg.log('main.loadPage() : Loading Page "' + page + '"  ( Controller & View )');
     // overwrite DOCUMENT with popup document instance
     let document  = chrome.extension.getViews({ type: 'popup' })[0].document;
     var a = pg.loadController(page).then( (controller) => {
     	//window[pg.config.appReference].view = controller;
     	pg.loadView(page).then( _html =>{
     		document.querySelector('#pg-view').innerHTML = _html;
     		// Bind & attach rivets view to controller as non-enumerable property
     		let rv_view =  pg.bind( document.querySelector('#pg-view') , { [page] : controller } );
     		Object.defineProperty(controller, '__view__', {
     			value: rv_view,
     			enumerable: false,
     			writable:true,
     			configurable: true
     		});
     		// make App controller accessible to loaded view , appending it
     		controller.__view__.update({ [page] : controller , app:this} );
     	});
     });
     */
				},


				Data: {
					Categories: [{
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
					Feeds: [
					/*
     {
     	id 			: 'eeed24d2-be2f-42bc-dc3a-3ebf9ba4eff3',
     	name 		: 'Kat (All)',
     	url 		: 'https://kat.cr/?rss=1',
     	properies	: ['title'],
     	TTL 		: 10,
     	categories 	: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7','dd63224e-b59c-4b41-5f99-c63cffbbafe4','44748d67-be92-47a9-a5b6-de502f1e8cb5'],
     	lastUpdate 	: null
     },
     {
     	id 			: 'd44d24b3-af2f-12bd-abaa-2ebf9ba0f5c3',
     	name 		: 'Kat Movies',
     	url 		: 'https://kat.cr/movies/?rss=1',
     	properies	: ['title'],
     	TTL 		: 10,
     	categories 	: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
     	lastUpdate 	: null
     },
     */
					{
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
					var i = this.Data.Categories.findIndex(function (cat) {
						return cat.id === id ? true : false;
					});
					return i === -1 ? -1 : this.Data.Categories[i];
				},
				getCategoryByName: function getCategoryByName(id) {
					var i = this.Data.Categories.findIndex(function (cat) {
						return cat.name === id ? true : false;
					});
					return i === -1 ? -1 : this.Data.Categories[i];
				},
				countFeedsinCategory: function countFeedsinCategory(id) {
					var category = this.getCategoryById(id);
					if (category === -1) return -1;

					category.feeds = 0;
					for (var i = 0; i < this.Data.Feeds.length; i++) {
						if (this.Data.Feeds[i].categories.indexOf(id) !== -1) category.feeds++;
					}return category.feeds;
				},
				countFeedsinAllCategories: function countFeedsinAllCategories() {
					for (var i = 0; i < this.Data.Categories.length; i++) {
						this.countFeedsinCategory(this.Data.Categories[i].id);
					}return true;
				},
				getAllFeeds: function getAllFeeds() {
					var _this2 = this;

					return new Promise(function (_resolve, _reject) {
						pg.log('pg.updateAllFeeds(): Updating all Feeds...');
						var currentFeed = -1;
						// Loop through the Feeds with array.reduce...
						_this2.Data.Feeds.reduce(function (sequence) {
							return sequence.then(function () {
								currentFeed++;
								return _this2.getFeed(currentFeed);
							}).then(function (result) {
								if (result) pg.log('pg.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + _this2.Data.Feeds[currentFeed].name + ' UPDATED');else pg.log('pg.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + _this2.Data.Feeds[currentFeed].name + ' FAILED');
								if (currentFeed + 1 === _this2.Data.Feeds.length) _resolve();
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
						if (isNaN(i) && typeof i === 'string') feed = { url: i, name: '***' };else feed = _this3.Data.Feeds[i];

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

			_export('default', main);
		}
	};
});
//# sourceMappingURL=main.js.map
