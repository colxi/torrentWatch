(function(){
	'use strict';

	var observers = {};

	window.app = {
		/**
		 * [feeds description]
		 * @type {Array}
		 */
		feeds : [
			{
				id 			: 0,
				name 		: 'Kat Movies',
				url 		: 'https://kat.cr/movies/?rss=1',
				property	: 'title',
				TTL 		: 10,
				items 		: {}
			},{
				id 			: 1,
				name 		: 'Mininova Movies',
				url 		: 'http://www.mininova.org/rss.xml?cat=4',
				property	: 'title',
				TTL 		: 10,
				items 		: {}
			},{
				id 			: 2,
				name 		: 'YIFY Movies',
				url 		: 'https://yts.ag/rss',
				property	: 'title',
				TTL 		: 10,
				items 		: {}
			}
		],
		/**
		 * [description]
		 * @param  {[type]} ){ return
		 * @return {[type]}     [description]
		 */
		getManifest : function(){ return chrome.app.getDetails(); },
		getVersion : function(){ return chrome.app.getDetails().version; },
		getCurrentLocale : function(){ return chrome.app.getDetails().current_locale; },
		/**
		 * [description]
		 * @param  {[type]} )
		 * @return {[type]}   [description]
		 */
		_init : document.addEventListener('DOMContentLoaded', function() {
  			app.getManifest();
  			delete app._init;

  			console.log("Starting Torrent Observer v." + app.getVersion() );

  			// set html file for toolbar icon popup
  			chrome.browserAction.setPopup( {popup:'views/popup/popup.html'} );
			app.popup = chrome.extension.getViews()[1].document;
			chrome.browserAction.onClicked.addListener(function(){
				console.log('Popup opened');
			});

			app.updateAllFeeds().then(function(){ console.log('Init done'); });
		}),
		/**
		 * [popup description]
		 * @type {[type]}
		 */
		popup : null,

		/**
		 * [updateAllFeeds description]
		 * @return {[type]} [description]
		 */
		updateAllFeeds : function(){
			return new Promise(function(resolve, reject){
				console.log('app.updateAllFeeds(): Updating all Feeds...');
				var currentFeed = -1;
				// Loop through the Feeds with array.reduce...
				app.feeds.reduce(function(sequence) {
					return sequence.then(function() {
						currentFeed++;
				 		return app.updateFeed(currentFeed);
					}).then(function(result) {
						if(result) console.log('app.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + app.feeds[currentFeed].name + ' UPDATED (' + result + ')' );
				    	else  console.log('app.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + app.feeds[currentFeed].name + ' FAILED (' + result + ')' );
				  	});
				} , Promise.resolve());
			});
		},
		updateFeed: function(i){
			return new Promise( function(resolve, reject){
				// block if requested feed does not exist
				if(i >= app.feeds.length) return reject(-1);
				// get feed
				var feed = app.feeds[i];
				console.log('app.updateFeed() : Updating Feed (#'+ ( feed.id ) +' : ' + feed.name + ')');
				//
				// Prepare Ajax request
				//
				var request = new XMLHttpRequest();
				request.open("get", feed.url, true);
				// RESPONSE OK
				request.onload  = function(_http){
					var parser = new DOMParser();
				   	var xmlDoc = parser.parseFromString(request.responseText,"text/xml");
					console.log(xmlDoc);
					xotree = new XML.ObjTree();
					request = null;
					return resolve(true);
				};
				// RESPONSE FAIL
				request.onerror  = function(_http){
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


