'use strict';

(function () {
	'use strict';

	var observers = {};

	window.app = {
		feeds: [{
			id: 0,
			name: 'Kat Movies',
			url: 'https://kat.cr/movies/?rss=1',
			property: 'title',
			TTL: 10,
			items: {}
		}, {
			id: 1,
			name: 'Mininova Movies',
			url: 'http://www.mininova.org/rss.xml?cat=4',
			property: 'title',
			TTL: 10,
			items: {}
		}, {
			id: 2,
			name: 'YIFY Movies',
			url: 'https://yts.ag/rss',
			property: 'title',
			TTL: 10,
			items: {}
		}],
		_init: document.addEventListener('DOMContentLoaded', function () {
			console.log("Starting Torrent Observer");
			delete app._init;

			// set html file for toolbar icon popup
			chrome.browserAction.setPopup({ popup: 'views/popup/popup.html' });
			app.popup = chrome.extension.getViews()[1].document;

			app.updateAllFeeds().then(function () {
				console.log('Init done');
			});
		}),
		popup: null,
		updateAllFeeds: function updateAllFeeds() {
			return new Promise(function (resolve, reject) {
				console.log('app.updateAllFeeds(): Updating all Feeds...');
				var currentFeed = -1;
				// Loop through the Feeds with array.reduce...
				app.feeds.reduce(function (sequence) {
					return sequence.then(function () {
						currentFeed++;
						return app.updateFeed(currentFeed);
					}).then(function (result) {
						if (result) console.log('app.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + app.feeds[currentFeed].name + ' UPDATED (' + result + ')');else console.log('app.updateAllFeeds(): Feed #' + (currentFeed + 1) + ' ' + app.feeds[currentFeed].name + ' FAILED (' + result + ')');
					});
				}, Promise.resolve());
			});
		},
		updateFeed: function updateFeed(i) {
			return new Promise(function (resolve, reject) {
				// block if requested feed does not exist
				if (i >= app.feeds.length) return reject(-1);
				// get feed
				var feed = app.feeds[i];
				console.log('app.updateFeed() : Updating Feed (#' + feed.id + ' : ' + feed.name + ')');
				//
				// Prepare Ajax request
				//
				var request = new XMLHttpRequest();
				request.open("get", feed.url, true);
				// RESPONSE OK
				request.onload = function (_http) {
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(request.responseText, "text/xml");
					console.log(xmlDoc);
					xotree = new XML.ObjTree();
					request = null;
					return resolve(true);
				};
				// RESPONSE FAIL
				request.onerror = function (_http) {
					console.log("Error", request.statusText);
					request = null;
					return resolve(false);
				};
				// Send Request
				request.send(null);
			});
		}
	};
})();

// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
	// Query filter to be passed to chrome.tabs.query - see
	// https://developer.chrome.com/extensions/tabs#method-query
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, function (tabs) {
		// chrome.tabs.query invokes the callback with a list of tabs that match the
		// query. When the popup is opened, there is certainly a window and at least
		// one tab, so we can safely assume that |tabs| is a non-empty array.
		// A window can only have one active tab at a time, so the array consists of
		// exactly one tab.
		var tab = tabs[0];

		// A tab is a plain object that provides information about the tab.
		// See https://developer.chrome.com/extensions/tabs#type-Tab
		var url = tab.url;

		// tab.url is only available if the "activeTab" permission is declared.
		// If you want to see the URL of other tabs (e.g. after removing active:true
		// from |queryInfo|), then the "tabs" permission is required to see their
		// "url" properties.
		console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url);
	});

	// Most methods of the Chrome extension APIs are asynchronous. This means that
	// you CANNOT do something like this:
	//
	// var url;
	// chrome.tabs.query(queryInfo, function(tabs) {
	//   url = tabs[0].url;
	// });
	// alert(url); // Shows "undefined", because chrome.tabs.query is async.
}
//# sourceMappingURL=main.js.map
