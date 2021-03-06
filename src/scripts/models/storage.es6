/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let storage = {
	__constructor(){
		return new Promise(resolve=>{
			pg.log('[Model]:storage.__constructor() : Preparing for Initial Data Syncronization...');
			chrome.storage.sync.get( 'feeds', f=>{
				chrome.storage.sync.get( 'categories', c=>{
					chrome.storage.sync.get( 'watchers', w=>{
						this.Data.feeds 	=  f.feeds 		|| [];
		    			this.Data.categories=  c.categories || [];
		    			this.Data.watchers 	=  w.watchers 	|| [];
						pg.log('[Model]:storage.__constructor() : Data Sync done. ['+this.Data.feeds.length+'] Feeds | ['+this.Data.categories.length+'] Categories | ['+this.Data.watchers.length+'] Watchers')
		    			resolve();
			    	});
		    	});
			});
		});
	},

 	Data : {
        feeds : [],
        watchers : [],
        categories : []
    },

    onChange : (function(){
		return chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (let key in changes) {
				if( !changes.hasOwnProperty(key) ) continue;
				var storageChange = changes[key];
				console.log('Storage key "%s" in namespace "%s" changed. ' +
				          'Old value was "%s", new value is "%s".',
				          key,
				          namespace,
				          storageChange.oldValue,
				          storageChange.newValue);
				}
		});
    })(),
	sync:{
		feeds: function(){
	    	return new Promise(function(resolve){
				chrome.storage.sync.set({'feeds': storage.Data.feeds} , r=> resolve(true) );
		    });
		},
		categories: function(){
		   return new Promise(function(resolve){
				chrome.storage.sync.set({'categories': storage.Data.categories} , r=> resolve(true) );
		   });
		},
		watchers: function(){
		   return new Promise(function(resolve){
				chrome.storage.sync.set({'watchers': storage.Data.watchers} , r=> resolve(true) );
		   });
		},
	},
	set: {}
};

export default storage;
