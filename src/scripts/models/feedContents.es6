/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let feedContents = {
	__constructor(){
		 return new Promise(function(_resolve){
			pg.load.module('JSON/parseXML')
				.then( r => pg.load.model('feeds') )
				.then( r=> _resolve(r) );
        });
	},

 	tasks : [],

	scheduleUpdates(){
	    return new Promise( _resolve => {
	    	_resolve();
	        /*
	        console.log('chromeExt.scheduler.initialize(): Scheduling SYNC for '+ chromeExt.Data.feeds.length+' feeds sources...');
	        console.log(chromeExt.Data);
	        for(let i=0; i<chromeExt.Data.feeds.length; i++){
	            console.log('chromeExt.scheduler.initialize(): Scheduling ' + chromeExt.Data.feeds[i].name +' (TTL : '+ chromeExt.Data.feeds[i].TTL + ' min)');
	            chromeExt.scheduler.tasks.push(
	                setInterval( function(){
	                    console.log('checking feed...');
	                }, chromeExt.Data.feeds[i].TTL * 60 * 1000)
	            );
	        }
	        */
	    });
	},


	getAll(){
		return new Promise( (_resolve, _reject)=>{
			pg.log('pg.updateAllFeeds(): Updating all Feeds...');
			var currentFeed = -1;
			// Loop through the Feeds with array.reduce...
			app.Data.feeds.reduce( (sequence) => {
				return sequence.then( ()=> {
					currentFeed++;
			 		return feedContents.get(app.Data.feeds[currentFeed].id);
				}).then( (result)=> {
					if(result) pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + app.Data.feeds[currentFeed].name + ' UPDATED' );
			    	else  pg.log('pg.updateAllFeeds(): Feed #'+ ( currentFeed + 1) +' ' + app.Data.feeds[currentFeed].name + ' FAILED' );
			  		if( (currentFeed + 1)=== app.Data.feeds.length) _resolve();
			  	});
			} , Promise.resolve());
		});
	},

	get(id){
		return new Promise( _resolve=>{
			if(id === undefined || id === null || id === '') return _resolve(-1);

			// get feed (allow feed Id index or string url feed)
			let f;

			f = pg.models.feeds.get(id);
			if( f === -1 ) f = { url : id , name : '***', status : {}};

			f.status.code = 100;
			f.status.details = 'Updating...';
			f.status.lastCheck = new Date();

			pg.log('pg.updateFeed() : Updating Feed from :'+ f.url +' ( ' + f.name + ' )' );

			//
			// Prepare Ajax request
			//
			let http = new XMLHttpRequest();
			http.open('get', f.url, true);

			// RESPONSE OK
			http.onload  = r=>{
				let parser = new DOMParser();
			   	let xmlDoc = parser.parseFromString(http.responseText,'text/xml');
				let JSONxml = pg.JSON.parseXML(xmlDoc, true);

				f.status.code = 200;
				f.status.details = 'Ok';

				http = null;
				return _resolve(JSONxml);
			};
			// RESPONSE FAIL
			http.onerror  = r=>{
				pg.log('pg.getFeed(): Error on request... ' + http.statusText);
				f.status.code =  400;
				f.status.details = 'Fail';
				http = null;
				return _resolve(false);
			};
			// Send Request
			http.send(null);
		});
	},
};

export default feedContents;
