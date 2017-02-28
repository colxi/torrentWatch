/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let watchers = {
	__constructor(){},

	Data : undefined,

	page( page = 0 , limit=10, sortBy = '' , order='DESC' ){
        // get all items (clone array)
        let items = JSON.parse( JSON.stringify(pg.models.storage.Data.watchers) );

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
		let i = watchers.getIndexById(id);
		return (i === -1) ? -1 :  ( original ? pg.models.storage.Data.watchers[i] : JSON.parse( JSON.stringify(pg.models.storage.Data.watchers[i]) ) );
	},


    delete(id=''){
        return new Promise(function(resolve){
	    	console.log('[Model]:watchers.delete(): deleting watcher #'+id);
			// get index in array
			let i = watchers.getIndexById(id);
			// block if  id NOT found
			if(i === -1) resolve(false);
			// remove item from Data array
			pg.models.storage.Data.watchers.splice(i,1);
			// request to save new data
			pg.models.storage.sync.watchers().then( r => resolve(true) );
		});
    },

	save( watcher ){
        return new Promise(function(resolve){
			console.log('[Model]:watchers.save(): saving watcher #' + watcher.id);
			console.log(watcher);
			let i = watchers.getIndexById(watcher.id);
			if(i === -1) i = pg.models.storage.Data.watchers.length;
			pg.models.storage.Data.watchers[i] = watcher;
			pg.models.storage.sync.watchers().then( r => resolve(true) );
		});
	},


	new(){
		return {
			id 			: pg.guid(),
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

	getIndexById(id){
		return pg.models.storage.Data.watchers.findIndex( watcher=>(watcher.id === id ) ? true : false );
	},
};

export default watchers;
