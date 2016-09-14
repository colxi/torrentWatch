/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let feeds = {
	__constructor(){
	   return new Promise(function(_resolve){
            pg.load.model('storage', 'categories').then( r=>_resolve(r) );
        });
	},

	page( page = 0 , limit=10, sortBy = '' , order='DESC' ){
        // get all items (clone array)
        let items = JSON.parse( JSON.stringify(pg.models.storage.Data.feeds) );

        // TO DO : sort by key
        // TO DO : apply ASC DESC order

    	// if a page is requested, slice array , and select only corresponding items
        if(page > 0){
        	let firstIndex = (page * limit) - limit;
        	let lastIndex = (firstIndex + limit - 1) < items.length ? (firstIndex + limit ) : items.length ;
        	items = items.slice(firstIndex, lastIndex);
        }
        // done ! return items;
        return items;
    },

    get(id='',original = false){
		let i = feeds.getIndexById(id);
		return (i === -1) ? -1 :  ( original ? pg.models.storage.Data.feeds[i] : JSON.parse( JSON.stringify(pg.models.storage.Data.feeds[i]) ) );
	},

    delete(id=''){
        return new Promise(function(resolve){
	    	console.log('[Model]:feeds.delete(): deleting feed #'+id);
			// get index in array
			let i = feeds.getIndexById(id);
			// block if  id NOT found
			if(i === -1) resolve(false);
			// remove item from Data array
			pg.models.storage.Data.feeds.splice(i,1);
			// request to save new data
			pg.models.categories.updateFeedCount();
			pg.models.storage.sync.feeds().then( r => resolve(true) );
		});
    },

	save( feed ){
        return new Promise(function(resolve){
			console.log('[Model]:feeds.save(): saving feed #' + feed.id);
			let i = feeds.getIndexById(feed.id);
			if(i === -1) i = pg.models.storage.Data.feeds.length;
			pg.models.storage.Data.feeds[i] = feed;
			pg.models.categories.updateFeedCount();
			pg.models.storage.sync.feeds().then( r => resolve(true) );
		});
	},

	new(){
		return {
			id 				: pg.guid(),
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

	getItemsProperties(feed){
		let prop = [];
		for(let i in feed.rss.channel.item[0]){
		 	if( feed.rss.channel.item[0].hasOwnProperty(i) &&  i.charAt(0).match(/[A-Z|a-z]/i) ) prop.push(i);
		}
		return prop;
	},


	getIndexById(id){
		return pg.models.storage.Data.feeds.findIndex( feed=>(feed.id === id ) ? true : false );
	},
};

export default feeds;
