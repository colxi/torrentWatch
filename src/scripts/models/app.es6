/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

// let main extends pg.__Controller{
let app ={
	__constructor(){
		return new Promise( (resolve,reject) =>{
			pg.log('*** Starting Torrent Observer v.' + pg.getVersion() );

			// load some required pg modules
			pg.load.module('JSON/parseXML' , 'FORM/validation').then( r => {
				// make form validation resources bindable
				this.regExp = pg.FORM.validation.pattern;
				this.regExpInfo = pg.FORM.validation.title;
	  			this.countFeedsinAllCategories();
				this.getAllFeeds().then( resolve );
			});
		});

	},

	location : 'categories',

	regExp : {},

	regExpInfo : {},

	Data : {
		watchers : [
			{
				name: 'ghostbusters',
				categories : ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
				directives : [
					{
						in : 'title',
						has : 'ghostbusters'
					}
				],
			}
		],
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
				id 					: 'a34d24b3-cc2f-6add-b2f0-5ebe9ac0f521',
				name 				: 'Mininova Movies',
				url 				: 'http://www.mininova.org/rss.xml?cat=4',
				fields				: {
					available 			: ['title'],
					assignations 		: {
						title 				: 'title',
						magnet 				: undefined,
						url 				: undefined
					}
				},
				propertiesWatched 	: ['title'],
				TTL 				: 10,
				categories 			: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7', '44748d67-be92-47a9-a5b6-de502f1e8cb5', '44748d67-be92-47a9-a5b6-de502f1e8cb5'],
				status 				: {
					lastCheck 			: null,
					code 				: 200,
					details 			: undefined
				}
			},
			//
			{
				id 					: 'bdv424b6-cb1c-3aab-11b3-ac429bb0f530',
				name 				: 'YIFY Movies',
				url 				: 'https://yts.ag/rss',
				fields				: {
					available 			: ['title'],
					assignations 		: {
						title 				: 'title',
						magnet 				: undefined,
						url 				: undefined
					}
				},
				TTL 				: 10,
				categories 			: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7', '44748d67-be92-47a9-a5b6-de502f1e8cb5'],
				status 				: {
					lastCheck 			: null,
					code 				: 200,
					details 			: undefined
				}
			},
			//
			{
				id 					: 'bdv424b6-cb1c-3aab-11b3-ac429bb0f531',
				name 				: 'Cucu Movies',
				url 				: 'https://yts.ag/rss',
				fields				: {
					available 			: ['title'],
					assignations 		: {
						title 				: 'title',
						magnet 				: undefined,
						url 				: undefined
					}
				},
				TTL 				: 10,
				categories 			: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
				status 				: {
					lastCheck 			: null,
					code 				: 200,
					details 			: undefined
				}
			},
			//
			{
				id 					: 'bdv424b6-cb1c-3aab-11b3-ac429bb0f532',
				name 				: 'Crashy RSS',
				url 				: 'https://willfail.ag/rss',
				fields				: {
					available 			: ['title'],
					assignations 		: {
						title 				: 'title',
						magnet 				: undefined,
						url 				: undefined
					}
				},
				TTL 				: 10,
				categories 			: ['f11d24b3-be2f-4bdd-d0e0-2ebf9ba0f5c7'],
				status 				: {
					lastCheck 			: null,
					code 				: 200,
					details 			: undefined
				}
			}
		]
	},

	emptyWatcher(){
		return {
			id 			: undefined,
		 	name 		: undefined,
			categories 	: [],
			directives 	: [
				{
					in 	: 'title',
					has : undefined
				}
			],
		};
	},

	saveWatcher(w){
		console.log('app.saveWatcher(): saving watcher');
		let i = app.getWatcherIndexById(w.id);
		if(i === -1) i = app.Data.watchers.length;
		app.Data.watchers[i] = w;
		return true;
	},

	getWatcherIndexById(id){
		return app.Data.watchers.findIndex( watcher=>(watcher.id === id ) ? true : false );
	},

	emptyCategory(){
		return {
			id 		: undefined,
			name 	: undefined,
			feeds 	: 0
		};
	},

	saveCategory(c){
		console.log('app.saveCategory(): saving category');
		let i = app.getCategoryIndexById(c.id);
		if(i === -1) i = app.Data.categories.length;
		app.Data.categories[i] = c;
		app.countFeedsinAllCategories();
		return true;
	},

	deleteCategory(id){
		console.log('app.deleteCategory(): deleting category');
		let i = app.getCategoryIndexById(id);
		if(i === -1) return false;
		app.Data.categories.splice(i,1);
		app.countFeedsinAllCategories();
		return true;
	},

	getCategoryById(id){
			let i = app.Data.categories.findIndex( cat=>(cat.id === id ) ? true : false );
			return (i === -1) ? -1 : app.Data.categories[i];
	},

	getCategoryIndexById(id){
		return app.Data.categories.findIndex( category=>(category.id === id ) ? true : false );
	},

	getCategoryByName(id){
		let i = app.Data.categories.findIndex( cat=>(cat.name === id ) ? true : false );
		return (i === -1) ? -1 : app.Data.categories[i];
	},

	countFeedsinCategory(id){
		let category = app.getCategoryById(id);
		if(category === -1) return -1;

		category.feeds = 0;
		for (let i=0; i < app.Data.feeds.length; i++ ) if(app.Data.feeds[i].categories.indexOf(id) !== -1) category.feeds++;
		return category.feeds;
	},

	countFeedsinAllCategories(){
		for (let i=0; i < app.Data.categories.length; i++ ) app.countFeedsinCategory( app.Data.categories[i].id );
		return true;
	},

	saveFeed(f){
		console.log('app.saveFeed(): saving feed');
		let i = app.getFeedIndexById(f.id);
		if(i === -1) i = app.Data.feeds.length;
		app.Data.feeds[i] = f;
		app.countFeedsinAllCategories();
		return true;
	},

	deleteFeed(id){
		console.log('app.deleteFeed(): deleting feed');
		let i = app.getFeedIndexById(id);
		if(i === -1) return false;
		app.Data.feeds.splice(i,1);
		app.countFeedsinAllCategories();
		return true;
	},

	getFeedById(id, original = false){
		let i = app.getFeedIndexById(id);
		return (i === -1) ? -1 :  ( original  ? app.Data.feeds[i] : JSON.parse( JSON.stringify(app.Data.feeds[i]) ) );
	},

	getFeedIndexById(id){
		return app.Data.feeds.findIndex( feed=>(feed.id === id ) ? true : false );
	},

	emptyFeed(){
		return {
			id 				: undefined,
			name 			: undefined,
			url 			: undefined,
			fields	 		: {
				available 		: [],
				assignations 	: {
					title 			: undefined,
					magnet 			: undefined,
					url 			: undefined
				}
			},
			categories 		: [],
			TTL 			: 120,
			status 			: {
				lastCheck 		: undefined,
				code 			: undefined,
				details 		: undefined
			}
		};
	},

	getAllFeeds(){
		return new Promise( (_resolve, _reject)=>{
			pg.log('pg.updateAllFeeds(): Updating all Feeds...');
			var currentFeed = -1;
			// Loop through the Feeds with array.reduce...
			app.Data.feeds.reduce( (sequence) => {
				return sequence.then( ()=> {
					currentFeed++;
			 		return app.getFeed(app.Data.feeds[currentFeed].id);
				}).then( (result)=> {
					if(result) pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + app.Data.feeds[currentFeed].name + ' UPDATED' );
			    	else  pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + app.Data.feeds[currentFeed].name + ' FAILED' );
			  		if( (currentFeed + 1)=== app.Data.feeds.length) _resolve();
			  	});
			} , Promise.resolve());
		});
	},

	updateFeed(id){ app.getFeed(id) },

	getFeed(id){
		return new Promise( (_resolve, _reject)=>{
			if(id === undefined || id === null || id === '') return _reject(-1);

			// get feed (allow feed Id index or string url feed)
			let feed;

			feed = app.getFeedById(id, true);
			if( feed === -1 ) feed = { url : id , name : '***', status : {}};

			feed.status.code = 100;
			feed.status.details = 'Updating...';
			feed.status.lastCheck = new Date();

			pg.log('pg.updateFeed() : Updating Feed from :'+ feed.url +' ( ' + feed.name + ' )' );

			//
			// Prepare Ajax request
			//
			let request = new XMLHttpRequest();
			request.open('get', feed.url, true);

			// RESPONSE OK
			request.onload  = ()=>{
				let parser = new DOMParser();
			   	let xmlDoc = parser.parseFromString(request.responseText,'text/xml');
				let JSONxml = pg.JSON.parseXML(xmlDoc, true);

				feed.status.code = 200;
				feed.status.details = 'Ok';

				request = null;
				return _resolve(JSONxml);
			};
			// RESPONSE FAIL
			request.onerror  = ()=>{
				pg.log('pg.getFeed(): Error on request... ' + request.statusText);
				feed.status.code =  400;
				feed.status.details = 'Fail';
				request = null;
				return _resolve(false);
			};
			// Send Request
			request.send(null);
		});
	},

	getFeedItemsProperties : function(feed){
		let prop = [];
		for(let i in feed.rss.channel.item[0]){
		 	if( feed.rss.channel.item[0].hasOwnProperty(i) &&  i.charAt(0).match(/[A-Z|a-z]/i) ) prop.push(i);
		}
		return prop;
	},



	toogleArrayItem(item, array, event, object){
		let i = array.indexOf(item);
		if(i === -1) array.push(item);
		else array.splice(i, 1);
		console.log(arguments);
	}
};

export default app;
