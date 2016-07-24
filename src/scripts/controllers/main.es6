/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , rivets , pg , app */

// let main extends pg.__Controller{
let main ={
	__constructor(){
		return new Promise( (resolve,reject) =>{
			this.currentTab  	= 'tab-feeds';
			this.categories 	= pg.categories;
			this.feeds 			= pg.feeds;
			this.logStore		= pg.logStore;

			// Define pg App Name Reference
			pg.config.appReference = 'app'; // window.app

  			// set html file popup
  			chrome.browserAction.setPopup( {popup:'views/popup/popup.html'} );

			pg.log('*** Starting Torrent Observer v.' + pg.getVersion() );

			// require module libraries
			pg.log('main.__constructor() : Requiring JSON.parseXML...');
			pg.require('lib/JSON.parseXML').then( r => {
	  			pg.countFeedsinAllCategories();
				pg.getAllFeeds().then( r => {
					resolve( );
				});
			});
		});

	},

	popUpInit(){
		console.log('Popup opened!');
		let popup 			= chrome.extension.getViews({ type: 'popup' })[0];

		//app.binder 			= popup.rivets;
		//app.bind 			= popup.rivets.bind;
		//app.watch 			= popup.sightglass;
		//popup.app 			= app;

		//popup.rivets 		= rivets;
		//popup.sightglass 	= sightglass;

/*
		app.binder.configure({
			prefix: 'rv', 					// Attribute prefix in templates
			preloadData: true,				// Preload templates with initial data on bind
			rootInterface: '.',				// Root sightglass interface for keypaths
			templateDelimiters: ['{', '}'],	// Template delimiters for text bindings
			// Augment the event handler of the on-* binder
			handler: function(target, ev, binding) { return this.call(target, event, binding.view.models,binding); }
		});
*/

		rivets.bind( popup.document.querySelector('#app-wrapper') , { 'app' : app } );
		//pg.loadController('feeds');
	},

	toogleArrayItem(item, array, event, object){
		let i = array.indexOf(item);
		if(i === -1) array.push(item);
		else array.splice(i, 1);
		console.log(arguments);
	}
}

export default main;
