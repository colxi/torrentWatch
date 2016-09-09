/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let watchers = {
	__constructor(){},

	Data : undefined,

	page( page = 0 , count=10, sortBy = '' , order='DESC'){
        return new Promise(function(_resolve){
            chrome.storage.sync.get( 'watchers', r=>_resolve(r) );
        });
    },

    get(id=''){},

    delete(id=''){},

	save( w ){
		console.log('app.saveWatcher(): saving watcher');
		let i = watchers.getIndexById(w.id);
		if(i === -1) i = watchers.Data.length;
		watchers.Data.watchers[i] = w;
		chrome.storage.sync.set({'watchers': watchers.Data}, r=>{
          // Notify that we saved.
          console.log('Settings saved',r);
        });
		return true;
	},

	new(){
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

	getIndexById(id){
		return watchers.Data.findIndex( watcher=>(watcher.id === id ) ? true : false );
	},
};

export default watchers;
