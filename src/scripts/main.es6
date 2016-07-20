var pg,
	chrome;
(function(){
	'use strict';
	pg = {
		/**
		 * [configure description]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		configure : function(obj){} ,
		/**
		 * [loadController description]
		 * @param  {[type]} controller [description]
		 * @return {[type]}            [description]
		 */
		loadController : function(controller){
			pg.log('loadController() : Loading controller module :' + controller);
			System.import('/controllers/'+ controller +".js").then(function(controller){
   				console.log(controller);
			});
		},
		/**
		 * [controller description]
		 * @type {Object}
		 */
		controller : {

		},
		/**
		 * [description]
		 * @param  {[type]} )
		 * @return {[type]}   [description]
		 */
		_init : document.addEventListener('DOMContentLoaded', function() {
  			pg.require('imports/babel-polyfill/polyfill.min.js').then(function(){
  				pg.require('imports/systemjs/system.js').then(function(){
  					System.config({ baseURL: '/scripts' });
		  			pg.require('lib/JSON.parseXML').then(function(){
			  			pg.log('Starting Torrent Observer v.' + pg.getVersion() );

			  			// set html file for toolbar icon popup
			  			chrome.browserAction.setPopup( {popup:'views/popup/popup.html'} );
						chrome.browserAction.onClicked.addListener(function(){
							pg.popup = chrome.extension.getViews()[1].document;
							pg.log('Popup opened');
						});

			  			pg.countFeedsinAllCategories();
						pg.getAllFeeds().then(function(){ pg.log('Init done'); });

						delete pg._init;
		  			});
  				});
  			});
		}),
		/**
		 * [require description]
		 * @param  {[type]} url [description]
		 * @return {[type]}     [description]
		 */
		require: (function(){
			const config = {
				baseUrl : 'scripts/'
			};
			let _require = function(src) {
		    	return new Promise(function(resolve, reject){
				   	let filename = src.substring(src.lastIndexOf('/')+1);
					// if no extension, assume .JS and extract again the filenamename
					if(filename.lastIndexOf('.js') === -1){
						src = src + '.js';
						filename = src.substring(src.lastIndexOf('/')+1);
					}
				    // Adding the script tag to the head
				    let done = false;
				    let head = document.getElementsByTagName('head')[0];
				    let script = document.createElement('script');
				    script.type = 'text/javascript';
				    script.src = config.baseUrl + src;
				    pg.log(script.src);
					script.onload = script.onreadystatechange = function() {
						// attach to both events for cross browser finish detection:
						if ( !done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') ) {
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
			_require.config = function(custom_config){
				Object.assign(config,custom_config);
				return true;
			};
			return _require;
		})(),
		/**
		 * [feeds description]
		 * @type {Array}
		 */
		categories : [
			{
				id 		: 'f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7',
				name 	: 'movies',
				feeds 	: 0
			},{
				id 		: 'dd63224e-b59c-4b41-5f99-c63cffbbafe4',
				name 	: 'music',
				feeds 	: 0
			},{
				id 		: '44748d67-be92-47a9-a5b6-de502f1e8cb5',
				name 	: 'software',
				feeds 	: 0
			},{
				id 		: '91aa33c5-5099-48e8-b6a4-4a5946c0b617',
				name 	: 'others',
				feeds 	: 0
			}
		],
		feeds : [
			{
				id 			: 'eeed24d2-be2f-42bc-dc3a-3ebf9ba4eff3',
				name 		: 'Kat (All)',
				url 		: 'https://kat.cr/?rss=1',
				properies	: ['title'],
				TTL 		: 10,
				categories 	: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7','dd63224e-b59c-4b41-5f99-c63cffbbafe4','44748d67-be92-47a9-a5b6-de502f1e8cb5'],
				lastUpdate 	: null
			},{
				id 			: 'd44d24b3-af2f-12bd-abaa-2ebf9ba0f5c3',
				name 		: 'Kat Movies',
				url 		: 'https://kat.cr/movies/?rss=1',
				properies	: ['title'],
				TTL 		: 10,
				categories 	: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
				lastUpdate 	: null
			},{
				id 			: 'a34d24b3-cc2f-6add-b2f0-5ebe9ac0f521',
				name 		: 'Mininova Movies',
				url 		: 'http://www.mininova.org/rss.xml?cat=4',
				properies	: ['title'],
				TTL 		: 10,
				categories 	: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
				lastUpdate 	: null
			},{
				id 			: 'bdv424b6-cb1c-3aab-11b3-ac429bb0f530',
				name 		: 'YIFY Movies',
				url 		: 'https://yts.ag/rss',
				properies	: ['title'],
				TTL 		: 10,
				categories 	: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
				lastUpdate 	: null
			}
		],
		logStore : [],
		log : function(msg = '{empty}' , method = 'log'){
			pg.logStore.push(msg);
			console[method](msg);
			return true;
		},
		/**
		 * [description]
		 * @param  {[type]} ){ return
		 * @return {[type]}     [description]
		 */
		getManifest : function(){ return chrome.app.getDetails(); },
		getVersion : function(){ return chrome.app.getDetails().version; },
		getCurrentLocale : function(){ return chrome.app.getDetails().current_locale; },
		/**
		 * [popup description]
		 * @type {[type]}
		 */
		popup : null,
		/**
		 * [getCategoryById description]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		getCategoryById : function(id){
			let i = pg.categories.findIndex( cat=>(cat.id === id ) ? true : false );
			return (i === -1) ? -1 : pg.categories[i];
		},
		getCategoryByName : function(id){
			let i = pg.categories.findIndex( cat=>(cat.name === id ) ? true : false );
			return (i === -1) ? -1 : pg.categories[i];
		},
		countFeedsinCategory: function(id){
			let category = pg.getCategoryById(id);
			if(category === -1) return -1;

			category.feeds = 0;
			for (let i=0; i < pg.feeds.length; i++ ) if(pg.feeds[i].categories.indexOf(id) !== -1) category.feeds++;
			return category.feeds;
		},
		countFeedsinAllCategories: function(){
			for (let i=0; i < pg.categories.length; i++ ) pg.countFeedsinCategory( pg.categories[i].id );
			return true;
		},

		/**
		 * [updateAllFeeds description]
		 * @return {[type]} [description]
		 */
		getAllFeeds : function(){
			return new Promise(function(resolve, reject){
				pg.log('pg.updateAllFeeds(): Updating all Feeds...');
				var currentFeed = -1;
				// Loop through the Feeds with array.reduce...
				pg.feeds.reduce(function(sequence) {
					return sequence.then(function() {
						currentFeed++;
				 		return pg.getFeed(currentFeed);
					}).then(function(result) {
						if(result) pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + pg.feeds[currentFeed].name + ' UPDATED (' + result + ')' );
				    	else  pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + pg.feeds[currentFeed].name + ' FAILED (' + result + ')' );
				  	});
				} , Promise.resolve());
			});
		},
		/**
		 * [updateFeed description]
		 * @param  {[type]} i [description]
		 * @return {[type]}   [description]
		 */
		getFeed: function(i){
			return new Promise( function(resolve, reject){
				if(i === undefined || i === null || i === '') return reject(-1);

				// get feed (allow feed array index or string url feed)
				let feed;
				if( isNaN(i) && typeof i === 'string' ) feed= { url : i , name : '***'};
				else feed = pg.feeds[i];

				// block if requested feed does not exist
				if(feed === undefined) return reject(-1);

				pg.log('pg.updateFeed() : Updating Feed from :'+ feed.url +' ( ' + feed.name + ' )' );

				//
				// Prepare Ajax request
				//
				let request = new XMLHttpRequest();
				request.open('get', feed.url, true);

				// RESPONSE OK
				request.onload  = function(){
					let parser = new DOMParser();
				   	let xmlDoc = parser.parseFromString(request.responseText,'text/xml');
					let JSONxml = JSON.parseXML(xmlDoc);

					request = null;
					return resolve(JSONxml);
				};
				// RESPONSE FAIL
				request.onerror  = function(){
					pg.log('pg.getFeed(): Error on request.', request.statusText);
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
		createGuid : function(){
			function S4() {  return (((1+Math.random())*0x10000)|0).toString(16).substring(1) }
 			// then to call it, plus stitch in '4' in the third group
			return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
		}
	};

})();


