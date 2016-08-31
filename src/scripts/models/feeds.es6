/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let app;

let feeds = {
	__constructor(){
		return new Promise(function(resolve){
			pg.load.model('app').then( m =>{
				app = m;
				resolve();
			});
		});
	},

	location : 'feeds/list',

	initialize : function(){ feeds.list.initialize(); },

	list : {
		target : null,

		initialize :  function(mode = 'insert'){
			feeds.location = 'feeds/list';
		},

		show_deleteFeedDialog: function(id){
			feeds.list.target = app.getFeedById(id);
			feeds.location = 'feeds/list_delete';
		},

		delete_feed: function(id){
			app.deleteFeed(id);
			feeds.list.initialize();
		}
	},

	form : {
		active 				: 'feedDeclarationForm',
		mode 				: 'insert', // | update
		error 				: false,
		title: {
			insert 			: 'New Feed :',
			update 			: 'Edit Feed :'
		},

		UI : {
			feedDeclarationForm 	: null,
			feedAssignationsForm 	: null,
			feedUrl 				: null
		},

		Data : {},


		initialize :  function(id = null){
			if( id !== null ){
				// EDIT MODE DETECTED! ... get Feed Data
				let feed = app.getFeedById(id);
				if( feed === -1) throw new Error('feeds.form.initialize(): Can\'t find Feed with ID : '+ id);
				feeds.form.mode = 'update';
				feeds.form.Data = feed;
			}else{
				// INSERT MODE DETECTED ... generate new Feed
				feeds.form.mode 	= 'insert';
				feeds.form.Data 	= app.emptyFeed();
				feeds.form.Data.id 	= pg.guid();
			}

			feeds.form.error 	= false;
			feeds.location 		= 'feeds/form';
			feeds.form.show_feedDeclarationForm();
			return true;
		},

		show_feedDeclarationForm: function(){ feeds.form.active = 'feedDeclarationForm'; },
		show_feedAssignationsForm: function(){ feeds.form.active = 'feedAssignationsForm'; },

		validate_feedDeclarationForm: function(){
			pg.log( 'feeds.form.validate_feedDeclaration(): Validating Feed Declaration...' );
			// reset previous form validations
			feeds.form.error = false;
			feeds.form.UI.feedUrl.setCustomValidity('');
			// validate form
			if( !feeds.form.UI.feedDeclarationForm.checkValidity() ){
				pg.log( 'feeds.form.validate_feedDeclaration(): Form validation failed...' );
				feeds.form.error = 'Some fields require your attention.';
				return false;
			}
			// show loader
			pg.loader(feeds.form.UI.feedDeclarationForm).show('Validating Feed Source...');
			//
			// asyncronic feed url validation
			//
			app.getFeed(feeds.form.Data.url).then(function(_feed){
				// done! hide loader
				pg.loader(feeds.form.UI.feedDeclarationForm).hide();
				// block and return if failed
				if(!_feed){
					pg.log( 'feeds.form.validate_feedDeclaration(): URL validation failed...' );
					feeds.form.error = 'RSS Feed not found in URL.';
					feeds.form.UI.feedUrl.setCustomValidity('RSS Feed not found in URL.');
					return false;
				}
				// TO DO:
				//  - validate structure 'rss.channel.item'
				//  - validate item length > 0

				// store FEED ITEMS
				feeds.form.Data.__items = _feed.rss.channel.item;
				// succeed, get RSS feed item properties structure
				feeds.form.Data.fields.available  =  app.getFeedItemsProperties(_feed);
				// DONE ! show next FORM!
				feeds.form.show_feedAssignationsForm();
			});
		},

		validate_feedAssignationsForm: function(){
			pg.log( 'feeds.form.validate_feedAssignationsForm(): Validating Feed Assignations...' );
			// reset previous form validations
			feeds.form.error = false;
			// validate form
			if( !feeds.form.UI.feedAssignationsForm.checkValidity() ){
				pg.log( 'feeds.form.validate_feedAssignationsForm(): Form validation failed...' );
				feeds.form.error = 'Some fields require your attention.';
				return false;
			}
			// save feed Data
			app.saveFeed({
				id: feeds.form.Data.id,
				name: feeds.form.Data.name,
				url : feeds.form.Data.url,
				fields: {
					available: feeds.form.Data.fields.available,
					assignations: {
						title: feeds.form.Data.fields.assignations.title,
						magnet: feeds.form.Data.fields.assignations.magnet,
						url: feeds.form.Data.fields.assignations.url
					}
				},
				TTL: feeds.form.Data.TTL,
				categories: feeds.form.Data.categories,
				status: {
					lastCheck: new Date(),
					code: 200,
					details: undefined
				}
			});
			// DONE! display ending message!
			feeds.location = 'feeds/form_completed';
			return true;
		}
	}
};

export default feeds;
