/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let app;
let model;

let feeds = {
	__constructor(){
		pg.log('[Controller]:feeds.__constructor() : Initializating Feeds Controller');
		return new Promise(function(resolve){
			app = pg.controllers.app;
			pg.load.model('feeds').then( r => {
				pg.log(r);
				model = r;
				resolve() ;
			});
		});
	},

	location : 'feeds/list',

	initialize : function(){ feeds.list.initialize(); },

	list : {
		target : null,

		initialize :  function(mode = 'insert'){
			feeds.location = 'feeds/list';
			return feeds.list.page.current(1);
		},

		page:{
			count 	: undefined,
			current : function(num){
				return new Promise(resolve =>{
					if(typeof num === 'undefined') return resolve(this.current || 1);
					if(num > feeds.list.page.count) num = feeds.list.page.count;
					this.current = num;
					model.page(num, feeds.list.page.limit)
					.then(r =>{
						feeds.list.page.items = r;
						return model.page(0);
					})
					.then(r => {
						feeds.list.page.count = Math.ceil(r.length / feeds.list.page.limit);
						resolve(feeds.list.page.items);
					});
				});
			},
			limit 	: 2,
			order 	: 'DESC',
			sortBy 	: 'id',
	 		items 	: []
		},

		show_deleteFeedDialog: function(id){
			feeds.list.target = pg.models.feeds.get(id);
			feeds.location = 'feeds/list_delete';
		},

		delete_feed: function(id){
			pg.models.feeds.delete(id);
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
