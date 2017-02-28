/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let categories = {
	__constructor(){
	   return new Promise(function(_resolve){
            pg.load.model('storage').then( r=>_resolve(r) );
        });
	},

	page( page = 0 , limit=10, sortBy = '' , order='DESC' ){
        // get all items (clone array)
        let items = JSON.parse( JSON.stringify(pg.models.storage.Data.categories) );

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
		let i = categories.getIndexById(id);
		return (i === -1) ? -1 :  ( original ? pg.models.storage.Data.categories[i] : JSON.parse( JSON.stringify(pg.models.storage.Data.categories[i]) ) );
	},

	getByName(name){
		for(let i = 0; i < pg.models.storage.Data.categories.length; i++){
			if(pg.models.storage.Data.categories[i].name === name) return pg.models.storage.Data.categories[i];
		}
		return -1;
	},

    delete(id=''){
        return new Promise(function(resolve){
	    	console.log('[Model]:categories.delete(): deleting feed #'+id);
			// get index in array
			let i = categories.getIndexById(id);
			// block if  id NOT found
			if(i === -1) resolve(false);
			// remove item from Data array
			pg.models.storage.Data.categories.splice(i,1);
			// request to save new data
			pg.models.storage.sync.categories().then( r => resolve(true) );
		});
    },

	save( category ){
        return new Promise(function(resolve){
			console.log('[Model]:categories.save(): saving category #' + category.id);
			let i = categories.getIndexById(category.id);
			if(i === -1) i = pg.models.storage.Data.categories.length;
			pg.models.storage.Data.categories[i] = category;
			categories.updateFeedCount();
			pg.models.storage.sync.categories().then( r => resolve(true) );
        });
	},

	new(){
		return {
			id 		: pg.guid(),
			name 	: undefined,
			feeds 	: 0
		};
	},

	updateFeedCount(id=undefined){
		let _update = function(id){
			let category = categories.get(id);
			if(category === -1) return -1;

			category.feeds = 0;
			for (let i=0; i < pg.models.storage.Data.feeds.length; i++ ) if(pg.models.storage.Data.feeds[i].categories.indexOf(id) !== -1) category.feeds++;
			return category.feeds;
		};
		if(typeof id === 'undefined') for (let i=0; i < pg.models.storage.Data.categories.length; i++ ) _update( pg.models.storage.Data.categories[i].id );
		else _update( id );
		return true;
	},


	getIndexById(id){
		return pg.models.storage.Data.categories.findIndex( category=>(category.id === id ) ? true : false );
	},
};

export default categories;
