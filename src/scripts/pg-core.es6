/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , rivets  */

let pg;

(function(){
	'use strict';
	pg = {
		/**
		 * [configure description]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		 /*
		__Controller : class{
			constructor(name, module ) {
    			//module.__pg_controller = name; // ¿ injected native / babel ?
    			if(name === 'main') module.log = function(msg,type){ return pg.log(msg,type) };
    			module._expose = function(){
    				return Object.getOwnPropertyNames(module).filter( p => {
						return( ['_expose','prototype'].indexOf(p) === -1);
					});
				};
    			return module;
  			}
		},
		*/
		__Controller: function(name, module){
			module.name = name;
			if(name === 'main') module.log = function(msg,type){ return pg.log(msg,type) };
			module._expose = function(){
				return Object.getOwnPropertyNames(module).filter( p => {
					return( ['_expose','prototype'].indexOf(p) === -1);
				});
			};
			return module;
		},

		configure : function(obj){} ,
		config : {
			import_baseUrl : '/',
			appReference : 'app'
		},
		/**
		 * [loadController description]
		 * @param  {[type]} controller [description]
		 * @return {[type]}            [description]
		 */
		loadController : function(controllerId){
			pg.log( 'pg.loadController() : Loading controller module "' + controllerId + '"' );
			return new Promise(function(_resolve, _reject){
				// internal function used to end loadController routine, cleaning
				// CONTROLLER module and resolving promise...
				let __resolve_loadController = function(){
					if( controllerId === 'main') window[pg.config.appReference] = pg.controllers[controllerId];
					delete pg.controllers[controllerId].length; // babel transpiler autogen ¿?
					delete pg.controllers[controllerId].__constructor; // ensure one time executable
				 	_resolve( controllerId ,  pg.controllers[controllerId] );
				};
				// import CONTROLLER module
				System.import('/scripts/controllers/'+ controllerId +'.js').then(function(controller){
	   				// create CONTROLLER module instance
	   				window.a = controller;
	   				// ****
	   				// RIVETS cant read ES6 classes (..or babel transpilation)
	   				// soo using standard objects in modules...
	   				// pg.controllers[controllerId] = new controller.default(controllerId,controller.default );
	   				// ****
	   				pg.controllers[controllerId] = new pg.__Controller(controllerId, controller.default);
	   				// check if has custom constructor/igniter
	   				if( pg.controllers[controllerId].hasOwnProperty('__constructor') ){
	   					// execute CONTROLLER module custom constructor
	   					let _c = pg.controllers[controllerId].__constructor();
	   					// resolve pg.loadController (handle promise in CONTROLLER module __constructor)
	   					if(typeof _c.then === 'function') _c.then( r =>  __resolve_loadController() );
	   					else __resolve_loadController();
	   				}else __resolve_loadController();
				});
			});
		},
		/**
		 * [controller description]
		 * @type {Object}
		 */
		controllers : {

		},
		/**
		 * [description]
		 * @param  {[type]} )
		 * @return {[type]}   [description]
		 */
		_init : document.addEventListener('DOMContentLoaded', function() {
  			/* ES6 polyfill */
  			pg.log('pg._init() : Requiring Babel Polyfill...');
  			pg.require('imports/babel-polyfill/polyfill.min.js').then(function(){
  				// System js (import modules from the future)
  				pg.log('pg._init() : Requiring SystmJS...');
  				pg.require('imports/systemjs/system.js').then(function(){
  					System.config({ baseURL: pg.config.import_baseUrl });
		  			/* Sightglass ... data binding */
		  			pg.log('pg._init() : Requiring Sightglass...');
		  			pg.require('imports/sightglass/index.js').then(function(){
		  				/* Rivers data binding on steroids....*/
		  				pg.log('pg._init() : Requiring Rivets...');
			  			pg.require('imports/rivets/rivets.js').then(function(){
		  					/* Steroids expansion */
		  					pg.log('pg._init() : Requiring Rivets Formaters Lib... ( rivets.stdlib )');
			  				pg.require('lib/rivets.stdlib.js').then(function(){
			  					// configure RIVETS
			  					rivets.configure({
									prefix: 'rv', 					// Attribute prefix in templates
									preloadData: true,				// Preload templates with initial data on bind
									rootInterface: '.',				// Root sightglass interface for keypaths
									templateDelimiters: ['{', '}'],	// Template delimiters for text bindings
									// Augment the event handler of the on-* binder
									handler: function(target, ev, binding) { return this.call(target, event, binding.view.models,binding); }
								});
								sightglass.adapters = rivets.adapters;
								sightglass.root = rivets.rootInterface;
								pg.bind = rivets.bind;
								pg.watch = sightglass;
			  					/* Ready ! Load main module */
			  					pg.log('pg._init() : Loading MAIN controller...');
					  			pg.loadController('main').then( r =>{
			  						pg.log('pg._init() : Main Controller Loaded!');
					  			});
			  				});
		  				});
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
		    	return new Promise(function(_resolve, _reject){
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
				    //pg.log(script.src);
					script.onload = script.onreadystatechange = function() {
						// attach to both events for cross browser finish detection:
						if ( !done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') ) {
							// done! execute PROMISE _resolve
							done = true;
							// cleans up a little memory, removing listener;
							script.onload = script.onreadystatechange = null;
							_resolve();
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
			return new Promise(function(_resolve, _reject){
				pg.log('pg.updateAllFeeds(): Updating all Feeds...');
				var currentFeed = -1;
				// Loop through the Feeds with array.reduce...
				pg.feeds.reduce(function(sequence) {
					return sequence.then(function() {
						currentFeed++;
				 		return pg.getFeed(currentFeed);
					}).then(function(result) {
						if(result) pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + pg.feeds[currentFeed].name + ' UPDATED' );
				    	else  pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + pg.feeds[currentFeed].name + ' FAILED' );
				  		if( (currentFeed + 1)=== pg.feeds.length) _resolve();
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
			return new Promise( function(_resolve, _reject){
				if(i === undefined || i === null || i === '') return _reject(-1);

				// get feed (allow feed array index or string url feed)
				let feed;
				if( isNaN(i) && typeof i === 'string' ) feed= { url : i , name : '***'};
				else feed = pg.feeds[i];

				// block if requested feed does not exist
				if(feed === undefined) return _reject(-1);

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
					return _resolve(JSONxml);
				};
				// RESPONSE FAIL
				request.onerror  = function(){
					pg.log('pg.getFeed(): Error on request.', request.statusText);
					request = null;
					return _resolve(false);
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


