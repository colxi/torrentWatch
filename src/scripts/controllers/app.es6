/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let app ={
	__constructor(){
		pg.log('[Model]:app.__constructor(): Application Controller Initialization started.');
		pg.log('[Model]:app.__constructor(): Importing App Modules & dependencies...');
		return new Promise( resolve =>{
			// load some required pg modules
			pg.load.module('JSON/parseXML' , 'FORM/validation')
				.then( r => pg.load.model('storage' , 'feedContents') )
            	// get all Feeds Contents
            	.then( r => pg.models.feedContents.get() )
            	// schedule automatic Feed Contents update
            	.then( r => pg.models.feedContents.scheduleUpdates() )
            	.then( r =>{
					// make form validation resources bindable
					this.regExp = pg.FORM.validation.pattern;
					this.regExpInfo = pg.FORM.validation.title;
					resolve(true);
				});
		});

	},

	location : 'categories',

	regExp : {},

	regExpInfo : {},






	toogleArrayItem(item, array, event, object){
		let i = array.indexOf(item);
		if(i === -1) array.push(item);
		else array.splice(i, 1);
		console.log(arguments);
	}
};

export default app;
