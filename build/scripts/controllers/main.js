'use strict';

System.register([], function (_export, _context) {
	"use strict";

	var app, main;
	return {
		setters: [],
		execute: function () {
			app = {
				__constructor: function __constructor() {
					return new Promise(function (resolve, reject) {
						app.currentTab = 'tab-feeds';
						app.categories = pg.categories;
						app.feeds = pg.feeds;
						app.logStore = pg.logStore;
						app.Data = {
							Feeds: pg.feeds,
							Categories: pg.categories
						};

						// Define pg App Name Reference
						pg.config.appReference = 'app'; // window.app

						// set html file popup
						chrome.browserAction.setPopup({ popup: 'views/popup/popup.html' });

						pg.log('*** Starting Torrent Observer v.' + pg.getVersion());

						// require module libraries
						pg.log('app.__constructor() : Requiring JSON.parseXML...');
						pg.require('lib/JSON.parseXML').then(function (r) {
							pg.countFeedsinAllCategories();
							pg.getAllFeeds().then(function (r) {
								resolve();
							});
						});
					});
				},
				initialize: function initialize() {
					app.log('app.initialize(): Popup opened! Binding view...');
					// overwrite DOCUMENT with popup document instance
					var document = chrome.extension.getViews({ type: 'popup' })[0].document;
					// Bind & attach rivets view to App controller as non-enumerable property
					var rv_view = pg.bind(document.querySelector('#pg-app'), { 'app': app });
					// if first popup open , assign view; else update binding
					if (!app.hasOwnProperty('__view__')) {
						Object.defineProperty(app, '__view__', {
							value: rv_view,
							enumerable: false,
							writable: true,
							configurable: true
						});
					} else app.__view__.update();
				},
				loadPage: function loadPage(page) {
					app.log('app.loadPage() : Loading Page "' + page + '"  ( Controller & View )');
					// overwrite DOCUMENT with popup document instance
					var document = chrome.extension.getViews({ type: 'popup' })[0].document;
					// pg.loadController(page).then( (controller) => {
					pg.loadView(page).then(function (_html) {
						document.querySelector('#pg-view').innerHTML = _html;
						app.__view__.update();
						app.__view__.build();
						app.__view__.unbind();
						app.__view__.bind();
						// Bind & attach rivets view to controller as non-enumerable property
						/*
      let rv_view =  pg.bind( document.querySelector('#pg-view') , { [page] : controller } );
      Object.defineProperty(controller, '__view__', {
      	value: rv_view,
      	enumerable: false,
      	writable:true,
      	configurable: true
      });
      // make App controller accessible to loaded view , appending it
      controller.__view__.update({ [page] : controller , app:app} );
      */
					});
					// });
				},
				toogleArrayItem: function toogleArrayItem(item, array, event, object) {
					var i = array.indexOf(item);
					if (i === -1) array.push(item);else array.splice(i, 1);
					console.log(arguments);
				}
			};
			main = app;

			_export('default', main);
		}
	};
});
//# sourceMappingURL=main.js.map
